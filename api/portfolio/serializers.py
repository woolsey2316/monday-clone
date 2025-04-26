from django.contrib.auth.models import User
from .models import Education, Experience, Awards, Portfolio, PortfolioImage, CV, Aboutme, ProfileImage
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups']


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class PortfolioImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioImage
        fields = ['id', 'image', 'caption', 'ordinal']


class PortfolioSerializer(serializers.ModelSerializer):
    images = PortfolioImageSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ['id', 'title', 'description', 'url', 'ordinal', 'images']


class CVSerializer(serializers.ModelSerializer):
    class Meta:
        model = CV
        fields = ['id', 'title', 'file', 'uploaded_at', 'is_active']
        read_only_fields = ['uploaded_at']


class ProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = ['id', 'image', 'uploaded_at', 'is_active']
        read_only_fields = ['uploaded_at']


class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Awards
        fields = '__all__'


class AboutmeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aboutme
        fields = '__all__'
