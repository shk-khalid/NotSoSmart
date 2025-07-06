from django.conf import settings
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Task, ContextEntry, Category, UserProfile
from .serializers import TaskSerializer, ContextEntrySerializer, CategorySerializer, LoginSerializer, RegisterSerializer, ResetPasswordSerializer, CategorizeSerializer
from .hf_client import get_ai_task_suggestions
from .utils import suggest_category
from .supabase_client import supabase
from gotrue.errors import AuthApiError

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()   
    serializer_class = TaskSerializer

class ContextEntryViewSet(viewsets.ModelViewSet):
    queryset = ContextEntry.objects.all()
    serializer_class = ContextEntrySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        try:
            res = supabase.auth.sign_up({
                "email":    data["email"],
                "password": data["password"]
            })
            # If sign_up fails, AuthApiError is raised.
            # If it succeeds but no user object, treat as error
            if not getattr(res, "user", None):
                return Response(
                    {"detail": "Registration failed: no user returned."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            uid = res.user.id

            UserProfile.objects.create(
                supabase_uid=uid,
                username=data["username"],
                email=data["email"]
            )
            return Response(
                {"message": "User registered successfully."},
                status=status.HTTP_201_CREATED
            )

        except AuthApiError as e:
            return Response(
                {"detail": e.message},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": f"Unexpected error: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        try:
            res = supabase.auth.sign_in_with_password({
                "email":    data["email"],
                "password": data["password"]
            })

            session = getattr(res, "session", None)
            user = getattr(res, "user", None)
            
            if not session or not user:
                return Response(
                    {"detail": "Login failed: invalid credentials."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            access_token  = session.access_token
            refresh_token = session.refresh_token
            expires_in    = session.expires_in  # seconds until expiry, if available

            # Get or create user profile from local DB
            try:
                user_profile = UserProfile.objects.get(supabase_uid=user.id)
            except UserProfile.DoesNotExist:
                # Create profile if it doesn't exist (for existing Supabase users)
                user_profile = UserProfile.objects.create(
                    supabase_uid=user.id,
                    username=user.email.split('@')[0],  # fallback username
                    email=user.email
                )

            # Build response with the expected format
            resp = Response({
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {
                    "id": str(user_profile.supabase_uid),  # Use supabase_uid as string
                    "username": user_profile.username,
                    "email": user_profile.email
                }
            }, status=status.HTTP_200_OK)

            # Set HttpOnly cookies as backup
            resp.set_cookie(
                key="authToken",
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                max_age=expires_in or 3600
            )
            resp.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                max_age=90 * 24 * 3600
            )

            return resp

        except AuthApiError as e:
            return Response(
                {"detail": e.message},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": f"Unexpected error: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        ser = ResetPasswordSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data["email"]

        try:
            res = supabase.auth.reset_password_email(email)
            # If no exception, assume email sent
            return Response(
                {"message": "Password reset email sent."},
                status=status.HTTP_200_OK
            )

        except AuthApiError as e:
            return Response(
                {"detail": e.message},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": f"Unexpected error: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class CategorizeView(APIView):
    def post(self, request):
        ser = CategorizeSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data
        
        suggested = suggest_category(
            data["title"],
            data["description"]
        )
        return Response({"suggested_category": suggested}, status=status.HTTP_200_OK)
    
class AISuggestionView(APIView):
    def post(self, request):
        data = request.data
        try:
            title       = data.get("title", "")
            description = data.get("description", "")
            context     = data.get("context", "")

            output = get_ai_task_suggestions(title, description, context)

            # Parse output (basic version)
            lines = output.strip().splitlines()
            result = {
                "priority_score":      float(lines[0].split(":")[1].strip()),
                "suggested_deadline":  lines[1].split(":")[1].strip(),
                "enhanced_description": lines[2].split(":", 1)[1].strip(),
                "suggested_category":   lines[3].split(":")[1].strip()
            }

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)