from rest_framework import serializers
from .models import Task, ContextEntry, Category

# CRUD Operations
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ContextEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContextEntry
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        
# Authentication
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    email    = serializers.EmailField()
    password = serializers.CharField(min_length=6)

class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField()

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
# Categorization
class CategorizeSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField(allow_blank=True)
    