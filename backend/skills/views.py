from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from datetime import datetime, date, timedelta
from .models import Skill, UserProfile
from .serializers import SkillSerializer, UserProfileSerializer


class SkillViewSet(viewsets.ModelViewSet):
    """
    ModelViewSet automatically provides:
    - list() - GET /api/skills/ - Get all skills
    - create() - POST /api/skills/ - Create new skill
    - retrieve() - GET /api/skills/{id}/ - Get single skill
    - update() - PUT /api/skills/{id}/ - Update skill
    - partial_update() - PATCH /api/skills/{id}/ - Partial update
    - destroy() - DELETE /api/skills/{id}/ - Delete skill
    """
    serializer_class = SkillSerializer

    def get_queryset(self):
        return Skill.objects.all()

    def list(self, request):
        queryset = self.get_queryset()
        status_filter = request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        category_filter = request.query_params.get('category', None)
        if category_filter:
            queryset = queryset.filter(category=category_filter)
        search_query = request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(skill_name__icontains=search_query)
        queryset = queryset.order_by('-created_date')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='ai-resources')
    def ai_resources(self, request, pk=None):
        """
        POST /api/skills/{id}/ai-resources/
        Generates AI-powered resource recommendations
        """
        from .utils import get_ai_resources
        skill = self.get_object()

        # Check if already generated (cached)
        if skill.recommended_resources and skill.recommended_resources != '{}':
            try:
                cached = skill.get_recommended_resources()
                if cached and not cached.get('error'):
                    return Response({
                        'cached': True,
                        'skill_id': skill.id,
                        'skill_name': skill.skill_name,
                        'resources': cached
                    }, status=status.HTTP_200_OK)
            except:
                pass

        # Generate new recommendations
        resources = get_ai_resources(skill.skill_name, skill.resource_type)
        # Save to database
        skill.save()

        return Response({
            'cached': False,
            'skill_id': skill.id,
            'skill_name': skill.skill_name,
            'resources': resources
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='mastery-predict')
    def mastery_predict(self, request, pk=None):
        """POST /api/skills/{id}/mastery-predict/ - Get AI mastery prediction"""
        try:
            skill = self.get_object()
            from .utils import predict_mastery

            # Generate prediction (no database save needed)
            prediction = predict_mastery(
                skill.skill_name,
                skill.difficulty_rating,
                float(skill.hours_spent)
            )  # ✅ FIXED: Added closing parenthesis

            print(f"✅ Mastery prediction generated for: {skill.skill_name}")

            return Response({
                'success': True,
                'prediction': prediction
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"❌ Error in mastery_predict: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    Handles user profile CRUD operations
    """
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        return UserProfile.objects.all()

    @action(detail=False, methods=['get'], url_path='streak')
    def get_streak(self, request):
        """
        GET /api/profile/streak/
        Returns current streak data
        Creates profile if doesn't exist
        """
        profile, created = UserProfile.objects.get_or_create(id=1)
        serializer = self.serializer_class(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='update-streak')
    def update_streak(self, request):
        """
        POST /api/profile/update-streak/
        Updates streak based on activity
        Called internally when skills are created/updated
        """
        profile, created = UserProfile.objects.get_or_create(id=1)
        today = date.today()
        last_activity = profile.last_activity_date

        if last_activity is None:
            profile.current_streak = 1
            profile.longest_streak = 1
            profile.total_learning_days = 1
            profile.streak_started_date = today

        elif last_activity == today:
            pass

        elif last_activity == today - timedelta(days=1):
            profile.current_streak += 1
            profile.total_learning_days += 1
            if profile.current_streak > profile.longest_streak:
                profile.longest_streak = profile.current_streak

        else:
            profile.current_streak = 1
            profile.total_learning_days += 1
            profile.streak_started_date = today

        profile.last_activity_date = today
        profile.save()
        serializer = self.serializer_class(profile)
        return Response(serializer.data)


@api_view(['GET'])
def dashboard_stats(request):
    """
    GET /api/dashboard-stats/
    Returns aggregated statistics for dashboard
    """
    total_skills = Skill.objects.count()
    completed_skills = Skill.objects.filter(status='completed').count()

    completion_percentage = (
        (completed_skills / total_skills * 100) if total_skills > 0 else 0
    )  # ✅ FIXED: Added closing parenthesis

    total_hours = Skill.objects.aggregate(
        total=Sum('hours_spent')
    )['total'] or 0

    skills_by_category = Skill.objects.values('category').annotate(
        count=Count('id')
    ).order_by('-count')

    top_skills = Skill.objects.order_by('-hours_spent')[:10].values(
        'id', 'skill_name', 'hours_spent', 'status'
    )  # ✅ FIXED: Added closing parenthesis

    profile, created = UserProfile.objects.get_or_create(id=1)

    return Response({
        'total_skills': total_skills,
        'completed_skills': completed_skills,
        'completion_percentage': round(completion_percentage, 1),
        'total_hours': float(total_hours),
        'skills_by_category': list(skills_by_category),
        'top_skills': list(top_skills),
        'current_streak': profile.current_streak,
    })


@api_view(['POST'])
def weekly_summary(request):
    """
    POST /api/weekly-summary/
    Generates weekly summary with AI
    """
    seven_days_ago = date.today() - timedelta(days=7)
    recent_skills = Skill.objects.filter(
        created_date__gte=seven_days_ago
    )  # ✅ FIXED: Added closing parenthesis

    weekly_stats = {
        'skills_added': recent_skills.count(),
        'hours_logged': recent_skills.aggregate(
            total=Sum('hours_spent')
        )['total'] or 0,
        'completed_this_week': recent_skills.filter(
            status='completed'
        ).count(),
    }  # ✅ FIXED: Added closing brace

    ai_message = "Great week of learning! Keep up the momentum! 🚀"

    return Response({
        'stats': weekly_stats,
        'ai_message': ai_message,
    })
