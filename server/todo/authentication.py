from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from gotrue.errors import AuthApiError

from .supabase_client import supabase
from .models import UserProfile

class SupabaseAuthentication(BaseAuthentication):
    """
    Authenticate requests by validating the Bearer token with Supabase.
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None  # No credentials provided

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise exceptions.AuthenticationFailed("Invalid Authorization header")

        token = parts[1]
        try:
            # Validate token with Supabase
            user_resp = supabase.auth.get_user(token)
        except AuthApiError:
            raise exceptions.AuthenticationFailed("Invalid or expired token")

        user = getattr(user_resp, "user", None)
        if not user:
            raise exceptions.AuthenticationFailed("Invalid or expired token")

        # Map to your local UserProfile
        try:
            profile = UserProfile.objects.get(supabase_uid=user.id)
        except UserProfile.DoesNotExist:
            raise exceptions.AuthenticationFailed("User not found in local DB")

        # `profile` becomes request.user, `token` becomes auth
        return (profile, token)
