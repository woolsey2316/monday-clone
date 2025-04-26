from django.contrib.auth.models import User
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample

from .serializers import (
    UserSerializer, EducationSerializer, ExperienceSerializer,
    AwardSerializer, PortfolioSerializer, PortfolioImageSerializer,
    CVSerializer, AboutmeSerializer, ProfileImageSerializer
)
from .models import Awards, Education, Experience, Portfolio, PortfolioImage, CV, Aboutme, ProfileImage
from .permissions import IsAuthenticatedOrReadOnly


class ExperienceViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing work experience entries
    """
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class EducationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing education entries
    """
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class AboutmeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing about me information
    """
    queryset = Aboutme.objects.all()
    serializer_class = AboutmeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PortfolioViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing portfolio projects
    """
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        summary="Upload images to a portfolio project",
        description="Upload mages to an existing portfolio project.",
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'images': {'type': 'array', 'items': {'type': 'string', 'format': 'binary'}},
                    'captions': {'type': 'array', 'items': {'type': 'string'}},
                },
            }
        },
        responses={201: PortfolioImageSerializer(many=True)}
    )
    @action(detail=True, methods=['post'])
    def upload_images(self, request, pk=None):
        portfolio = self.get_object()
        files = request.FILES.getlist('images')
        captions = request.data.getlist('captions', [])

        images = []
        for index, file in enumerate(files):
            caption = captions[index] if index < len(captions) else ''
            image = PortfolioImage.objects.create(
                portfolio=portfolio,
                image=file,
                caption=caption,
                ordinal=len(images)
            )
            images.append(image)

        serializer = PortfolioImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Remove an image from a portfolio project",
        description="Delete a specific image from a portfolio project.",
        request={'application/json': {'type': 'object',
                                      'properties': {'image_id': {'type': 'integer'}}}},
        responses={204: None}
    )
    @action(detail=True, methods=['delete'])
    def remove_image(self, request, pk=None):
        portfolio = self.get_object()
        image_id = request.data.get('image_id')

        try:
            image = portfolio.images.get(id=image_id)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PortfolioImage.DoesNotExist:
            return Response(
                {'error': 'Image not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class CVViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing CV/resume files
    """
    queryset = CV.objects.all()
    serializer_class = CVSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        summary="Get active CV",
        description="Retrieve the currently active CV/resume.",
        responses={200: CVSerializer}
    )
    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Get the currently active CV
        """
        cv = CV.objects.filter(is_active=True).first()
        if cv:
            serializer = self.get_serializer(cv)
            return Response(serializer.data)
        return Response(
            {'error': 'No active CV found'},
            status=status.HTTP_404_NOT_FOUND
        )


class ProfileImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing profile images
    """
    queryset = ProfileImage.objects.all()
    serializer_class = ProfileImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        summary="Get active profile image",
        description="Retrieve the currently active profile image.",
        responses={200: ProfileImageSerializer}
    )
    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Get the currently active profile image
        """
        profile_image = ProfileImage.objects.filter(is_active=True).first()
        if profile_image:
            serializer = self.get_serializer(profile_image)
            return Response(serializer.data)
        return Response(
            {'error': 'No active profile image found'},
            status=status.HTTP_404_NOT_FOUND
        )


class AwardViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing awards and achievements
    """
    queryset = Awards.objects.all()
    serializer_class = AwardSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
