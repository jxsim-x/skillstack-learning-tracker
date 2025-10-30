from rest_framework import serializers
from .models import Skill, UserProfile
import json

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill  
        fields = '__all__'
        read_only_fields = ['id', 'created_date']
    
    def validate_difficulty_rating(self, value):
        """Ensures difficulty is between 1-5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Difficulty rating must be between 1 and 5."
            )
        return value
    
    def validate_hours_spent(self, value):
        """Ensures hours are not negative"""
        if value < 0:
            raise serializers.ValidationError(
                "Hours spent cannot be negative."
            )
        return value
    
    def to_representation(self, instance):
        """
        Override to parse JSON fields into proper dictionaries
        This makes the API response cleaner
        """
        representation = super().to_representation(instance)
        
        try:
            representation['recommended_resources'] = instance.get_recommended_resources()
        except:
            representation['recommended_resources'] = {}
        
        try:
            representation['mastery_prediction'] = instance.get_mastery_prediction()
        except:
            representation['mastery_prediction'] = {}
        
        return representation


class UserProfileSerializer(serializers.ModelSerializer):

    milestone_message = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = '__all__' 
        read_only_fields = ['id']
    
    def get_milestone_message(self, obj):
        """
        Returns milestone data if current streak hits a milestone
        Called automatically by SerializerMethodField
        """
        return obj.get_milestone_message()
    
    def validate(self, data):
        """
        Validates entire object
        Ensures current_streak doesn't exceed longest_streak
        """
        current = data.get('current_streak', 0)
        longest = data.get('longest_streak', 0)
        
        if current > longest:
            data['longest_streak'] = current
        
        return data