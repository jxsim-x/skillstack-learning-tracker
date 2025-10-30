from django.contrib import admin
from .models import Skill, UserProfile


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['skill_name', 'status', 'difficulty_rating', 'hours_spent', 'category', 'created_date']    
    list_filter = ['status', 'category', 'difficulty_rating']   
    search_fields = ['skill_name', 'platform']    
    readonly_fields = ['created_date']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['current_streak', 'longest_streak', 'total_learning_days', 'last_activity_date']
    readonly_fields = ['streak_started_date']