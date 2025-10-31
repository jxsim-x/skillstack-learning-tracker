import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in environment variables")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    print("Gemini API configured successfully")

def get_ai_resources(skill_name, resource_type='video'):
    if not GEMINI_API_KEY:
        return {
            'videos': [],
            'documentation': [],
            'courses': []
        }
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Simpler prompt that's easier for AI to follow
        prompt = f"""
         For learning {skill_name}, provide 3 REAL YouTube channel/video URLs and 2 REAL documentation links.
        
        Return ONLY this JSON format (no other text):
         {{
            "videos": [
                "Video Title 1 - https://www.youtube.com/watch?v=VIDEOID1",
                "Video Title 2 - https://www.youtube.com/watch?v=VIDEOID2",
                "Video Title 3 - https://www.youtube.com/watch?v=VIDEOID3"
            ],
            "documentation": [
                "Official Docs - https://official-documentation-url.com",
                "Guide - https://guide-or-tutorial-url.com"
            ],
            "courses": [
                "Course Name - https://www.udemy.com/course/actual-course-id"
            ]
        }}
        
        IMPORTANT:
        - Use REAL direct links (youtube.com/watch?v=... NOT /results?search)
        - Use ACTUAL documentation URLs (official docs, github, etc)
        - Make links clickable and working
        - Return ONLY JSON
        """
        
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Clean response
        if '```' in response_text:
            response_text = response_text.split('```json')[1].split('```')[0]
        elif '```' in response_text:
            response_text = response_text.split('``````')[0]
        
        response_text = response_text.strip()
        
        # Extract JSON
        if '{' in response_text and '}' in response_text:
            start = response_text.index('{')
            end = response_text.rindex('}') + 1
            response_text = response_text[start:end]
        
        try:
            result = json.loads(response_text)
            print(f"✅ AI Resources generated for: {skill_name}")
            return result
        except json.JSONDecodeError as e:
            print(f"⚠️ JSON parsing failed: {e}, using fallback")
        skill_lower = skill_name.lower().replace(' ', '-')
        return {
            'videos': [
                f"{skill_name} Tutorial - https://www.youtube.com/results?search_query={skill_name}+tutorial+{'-'.join(skill_name.split())}",
                f"Learn {skill_name} - https://www.youtube.com/results?search_query={skill_name}+course+beginners",
                f"{skill_name} for Beginners - https://www.youtube.com/results?search_query={skill_name}+getting+started"
            ],
            'documentation': [
                f"Official {skill_name} Docs - https://www.google.com/search?q={skill_name}+official+documentation",
                f"{skill_name} Guide - https://github.com/search?q={skill_name}+documentation"
            ],
            'courses': [
                f"Learn {skill_name} - https://www.udemy.com/courses/search/?q={skill_name}"
            ],
            'note': 'Fallback links - AI temporarily unavailable'
        }
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            'videos': [
                f"{skill_name} - https://www.youtube.com/results?search_query={skill_name}",
                f"Learn {skill_name} - https://www.youtube.com/results?search_query=learn+{skill_name}",
                f"{skill_name} Tutorial - https://www.youtube.com/results?search_query={skill_name}+tutorial"
            ],
            'documentation': [
                f"Docs - https://www.google.com/search?q={skill_name}+documentation",
                f"Guide - https://www.google.com/search?q={skill_name}+guide"
            ],
            'courses': [
                f"Course - https://www.udemy.com/courses/search/?q={skill_name}"
            ]
        }


def predict_mastery(skill_name, difficulty_rating, hours_spent):
    """
    Predict mastery timeline.
    AI first, then calculated fallback if AI fails.
    """
    # Calculate base metrics
    base_hours = difficulty_rating * 20
    remaining = max(0, base_hours - hours_spent)
    completion_pct = round((hours_spent / base_hours) * 100, 1) if base_hours > 0 else 0
    
    # Try AI first
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            prompt = f"""
            Learning prediction for: {skill_name}
            Difficulty: {difficulty_rating}/5
            Hours spent: {hours_spent}
            
            Respond with ONLY valid JSON:
            {{
                "estimated_weeks": <number>,
                "estimated_total_hours": <number>,
                "completion_percentage": <number>,
                "tips": ["tip1", "tip2", "tip3"],
                "ai_tools": ["tool1", "tool2"]
            }}
            
            Provide:
            - Estimated weeks to complete (at 10 hours/week)
            - Total hours needed
            - Current completion percentage
            - 3 specific learning tips
            - 2 AI tools that can help
            
            Return ONLY JSON, no explanations.
            """
            
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean markdown code blocks
            if '``` json' in response_text:
                parts = response_text.split('```json')
                if len(parts) > 1:
                    response_text = parts[1].split('```')[0]
            elif '```' in response_text:
                parts = response_text.split('```')
                if len(parts) > 1:
                    response_text = parts
            
            response_text = response_text.strip()
            
            # Extract JSON object
            if '{' in response_text and '}' in response_text:
                start = response_text.index('{')
                end = response_text.rindex('}') + 1
                response_text = response_text[start:end]
            
            try:
                result = json.loads(response_text)
                print(f"✅ Mastery prediction (AI) for: {skill_name}")
                return result
            except json.JSONDecodeError:
                print(f"⚠️ AI JSON parsing failed, using calculated fallback")
                # Fall through to calculated fallback
        
        except Exception as e:
            print(f"⚠️ AI prediction failed: {str(e)}, using calculated fallback")
            # Fall through to calculated fallback
    
    # Always return calculated fallback (whether AI disabled or failed)
    print(f"📊 Mastery prediction (calculated) for: {skill_name}")
    return {
        'estimated_weeks': round(remaining / 10, 1) if remaining > 0 else 1,
        'estimated_total_hours': base_hours,
        'completion_percentage': min(completion_pct, 100),
        'tips': [
            f'Practice {skill_name} daily for consistency',
            'Build real-world projects to apply concepts',
            'Join online communities for support'
        ],
        'ai_tools': ['ChatGPT for code help', 'GitHub Copilot for faster coding']
    }



def auto_categorize_skill(skill_name):
    if not GEMINI_API_KEY:
        return 'other'
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        Categorize the skill "{skill_name}" into exactly ONE of these categories:
        - frontend
        - backend
        - data
        - devops
        - other
        
        Respond with ONLY the category word, nothing else.
        """
        
        response = model.generate_content(prompt)
        category = response.text.strip().lower()
        
        valid_categories = ['frontend', 'backend', 'data', 'devops', 'other']
        if category in valid_categories:
            print(f"Auto-categorized '{skill_name}' as: {category}")
            return category
        else:
            print(f"Invalid category returned: {category}, defaulting to 'other'")
            return 'other'
    
    except Exception as e:
        print(f"Error auto-categorizing: {str(e)}")
        return 'other'


def generate_weekly_summary(weekly_stats):
    if not GEMINI_API_KEY:
        return {
            'stats': weekly_stats,
            'ai_message': 'Great week of learning! Keep up the momentum!'
        }
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        You are a motivational learning coach. Generate an encouraging weekly summary.
        
        This week's stats:
        - Skills added: {weekly_stats.get('skills_added', 0)}
        - Hours logged: {weekly_stats.get('hours_logged', 0)}
        - Skills completed: {weekly_stats.get('completed_this_week', 0)}
        
        Write a 2-3 sentence motivational message:
        - Celebrate achievements
        - Encourage consistency
        - Be positive and energetic
        
        Keep it under 150 characters. Use emojis.
        """
        
        response = model.generate_content(prompt)
        message = response.text.strip()
        
        print("Weekly summary generated")
        
        return {
            'stats': weekly_stats,
            'ai_message': message
        }
    
    except Exception as e:
        print(f"Error generating weekly summary: {str(e)}")
        return {
            'stats': weekly_stats,
            'ai_message': 'Keep learning and growing!',
            'error': str(e)
        }