from django.contrib import admin

# Register your models here.

from .models import Portfolio, Experience, Education, Awards, CV, PortfolioImage, Aboutme, ProfileImage

admin.site.register(Portfolio)
admin.site.register(Experience)
admin.site.register(Education)
admin.site.register(Awards)
admin.site.register(CV)
admin.site.register(PortfolioImage)
admin.site.register(Aboutme)
admin.site.register(ProfileImage)
