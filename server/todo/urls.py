from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, ContextEntryViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'contexts', ContextEntryViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
