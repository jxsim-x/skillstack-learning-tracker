from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SkillViewSet, 
    UserProfileViewSet, 
    dashboard_stats, 
    weekly_summary
)

router = DefaultRouter()

router.register(r'skills', SkillViewSet, basename='skill')
# Creates:
# GET    /api/skills/              - List all
# POST   /api/skills/              - Create
# GET    /api/skills/{id}/         - Retrieve one
# PUT    /api/skills/{id}/         - Update
# DELETE /api/skills/{id}/         - Delete
# POST   /api/skills/{id}/ai-resources/     - Custom action
# POST   /api/skills/{id}/mastery-predict/  - Custom action

router.register(r'profile', UserProfileViewSet, basename='profile')
# Creates:
# GET  /api/profile/streak/        - Custom action
# POST /api/profile/update-streak/ - Custom action

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-stats/', dashboard_stats, name='dashboard-stats'),
    path('weekly-summary/', weekly_summary, name='weekly-summary'),
]