from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'education', views.EducationViewSet)
router.register(r'experience', views.ExperienceViewSet)
router.register(r'projects', views.PortfolioViewSet)
router.register(r'awards', views.AwardViewSet)
router.register(r'cv', views.CVViewSet)
router.register(r'aboutme', views.AboutmeViewSet)
router.register(r'profileimage', views.ProfileImageViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
]
