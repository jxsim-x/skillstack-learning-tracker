from django.db import models
import json
class Skill(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ('video', 'Video'),
        ('course', 'Course'),
        ('article', 'Article'),
    ]
    
    STATUS_CHOICES = [
        ('started', 'Started'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('data', 'Data'),
        ('devops', 'DevOps'),
        ('other', 'Other'),
    ]
    

    skill_name = models.CharField(max_length=200)

    
    resource_type = models.CharField(
        max_length=20,
        choices=RESOURCE_TYPE_CHOICES,
        default='video'
    )

    
    platform = models.CharField(max_length=100, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='started'
    )

    
    hours_spent = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0.00
    )

    
    difficulty_rating = models.IntegerField(
        choices=[(i, i) for i in range(1, 6)],
        default=3
    )

    
    notes = models.TextField(blank=True)

    
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='other'
    )

    recommended_resources = models.TextField(blank=True, default='{}')

    
    mastery_prediction = models.TextField(blank=True, default='{}')

    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.skill_name
    

    def get_recommended_resources(self):
        """Returns recommended_resources as Python dictionary"""
        try:
            return json.loads(self.recommended_resources)
        except:
            return {}
    
    def set_recommended_resources(self, data):
        """Saves Python dictionary as JSON string"""
        self.recommended_resources = json.dumps(data)
    
    def get_mastery_prediction(self):
        """Returns mastery_prediction as Python dictionary"""
        try:
            return json.loads(self.mastery_prediction)
        except:
            return {}
    
    def set_mastery_prediction(self, data):
        """Saves Python dictionary as JSON string"""
        self.mastery_prediction = json.dumps(data)
    

    class Meta:
        ordering = ['-created_date'] 


class UserProfile(models.Model):
   
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    total_learning_days = models.IntegerField(default=0)
    streak_started_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"User Profile - Streak: {self.current_streak} days"
    
    def get_milestone_message(self):
        """Returns milestone message and badge if current streak hits a milestone"""
        milestones = {
            1: {"message": "50% of people never start. But you did! 🚀", "badge": "🏅"},
            3: {"message": "Only 30% make it to Day 3. You're ahead of the curve! 💪", "badge": "⭐"},
            7: {"message": "Week 1 complete! 80% quit by now. You're unstoppable! 🔥", "badge": "🏆"},
            14: {"message": "Two weeks strong! You're building real discipline. 💎", "badge": "💫"},
            21: {"message": "21 days! Scientists say habits form now. You're a pro! 🧠", "badge": "👑"},
            30: {"message": "ONE MONTH! This is legendary commitment! 🎯", "badge": "🌟"},
            50: {"message": "50 days! You're in the top 1% of learners! 🚀", "badge": "💥"},
            75: {"message": "75 days! Your dedication is truly inspiring! 🌈", "badge": "🎖️"},
            100: {"message": "💯 DAYS! EXTRAORDINARY! You're unstoppable! 🔥🔥🔥", "badge": "🏅🏅🏅"},
            365: {"message": "🎉 ONE YEAR! You're a learning CHAMPION! 🏆🎊", "badge": "👑👑👑"},
        }
        
        if self.current_streak in milestones:
            return milestones[self.current_streak]
        return None
    
    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"