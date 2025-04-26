from django.db import models
import os
from uuid import uuid4


def get_file_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid4()}.{ext}"

    if isinstance(instance, PortfolioImage):
        return os.path.join('portfolio', 'images', filename)
    elif isinstance(instance, Awards):
        return os.path.join('awards', 'images', filename)
    elif isinstance(instance, CV):
        return os.path.join('cv', 'documents', filename)
    elif isinstance(instance, ProfileImage):
        return os.path.join('profile', 'images', filename)
    return filename

# Create your models here.


class Education(models.Model):
    school = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    years = models.CharField(max_length=50)
    grade = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField()
    ordinal = models.IntegerField()

    class Meta:
        ordering = ['ordinal']

    def __repr__(self):
        return self.degree


class Aboutme(models.Model):
    description = models.TextField()

    def __repr__(self):
        return self.description


class Experience(models.Model):
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True, null=True)
    years = models.CharField(max_length=50)
    description = models.TextField()
    ordinal = models.IntegerField()

    class Meta:
        ordering = ['ordinal']

    def __repr__(self):
        return self.title


class Portfolio(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    url = models.URLField()
    ordinal = models.IntegerField()

    class Meta:
        ordering = ['ordinal']

    def __repr__(self):
        return self.title


class PortfolioImage(models.Model):
    portfolio = models.ForeignKey(
        Portfolio, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_file_path)
    caption = models.CharField(max_length=255, blank=True)
    ordinal = models.IntegerField(default=0)

    class Meta:
        ordering = ['ordinal']

    def __repr__(self):
        return f"Image for {self.portfolio.title}"


class CV(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to=get_file_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = 'CV'
        verbose_name_plural = 'CVs'

    def __repr__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.is_active:
            CV.objects.all().update(is_active=False)
        super().save(*args, **kwargs)


class ProfileImage(models.Model):
    image = models.ImageField(upload_to=get_file_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = 'Profile Image'
        verbose_name_plural = 'Profile Images'

    def __repr__(self):
        return self.image.name

    def save(self, *args, **kwargs):
        if self.is_active:
            ProfileImage.objects.all().update(is_active=False)
        super().save(*args, **kwargs)


class Awards(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to=get_file_path)
    ordinal = models.IntegerField()

    class Meta:
        ordering = ['ordinal']

    def __repr__(self):
        return self.title
