from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TaskViewSet,
    ContextEntryViewSet,
    CategoryViewSet,
    RegisterView,
    LoginView,
    ResetPasswordView,
    CategorizeView,
    AISuggestionView
)

router = DefaultRouter()
router.register(r'tasks',      TaskViewSet,        basename='tasks')
router.register(r'contexts',   ContextEntryViewSet,basename='contexts')
router.register(r'categories', CategoryViewSet,    basename='categories')

urlpatterns = [
    path('', include(router.urls)),

    # Auth (public)
    path('auth/register/',       RegisterView.as_view(),       name='register'),
    path('auth/login/',          LoginView.as_view(),          name='login'),
    path('auth/reset-password/', ResetPasswordView.as_view(),  name='reset-password'),

    # Smart categorize & AI (protected)
    path('tasks/suggest-category/', CategorizeView.as_view(),    name='suggest-category'),
    path('ai/suggestions/',          AISuggestionView.as_view(),  name='ai-suggestions'),
]
