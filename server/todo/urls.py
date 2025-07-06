from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, ContextEntryViewSet, CategoryViewSet, RegisterView, LoginView, ResetPasswordView, CategorizeView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'contexts', ContextEntryViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('auth/reset-password/', ResetPasswordView.as_view()),
    path('tasks/suggest-category/', CategorizeView.as_view()),
]
