# SkillStack - AI-Powered Learning Tracker

A full-stack web application for tracking learning goals with AI-powered recommendations and gamified daily streaks.

## 🚀 Features

- ✅ **Skill Tracking** - Add, edit, and manage learning goals
- ✅ **AI Recommendations** - Google Gemini API powered resource suggestions
- ✅ **Gamified Streaks** - Daily learning streaks with motivational milestones
- ✅ **Data Visualization** - Interactive charts showing learning progress
- ✅ **Weekly Summaries** - AI-generated learning reports

## 🛠️ Tech Stack

### Backend
- Python 3.x
- Django 5.x
- Django REST Framework
- Google Gemini AI API
- SQLite Database

### Frontend
- React 18
- Vite
- Axios
- Chart.js
- React Router

## 📦 Installation

### Backend Setup

Navigate to backend folder
cd backend

Create virtual environment
python -m venv venv

Activate virtual environment
Windows PowerShell:
.\venv\Scripts\activate

Install dependencies
pip install django djangorestframework django-cors-headers google-generativeai python-dotenv

Create .env file and add your Gemini API key
GEMINI_API_KEY=your_key_here
Run migrations
python manage.py migrate

Create superuser
python manage.py createsuperuser

Start server
python manage.py runserver

text

### Frontend Setup

Navigate to frontend folder
cd frontend

Install dependencies
npm install

Start development server
npm run dev

text

## 🔧 Configuration

1. **Backend**: Create `.env` file in `backend/` folder:
GEMINI_API_KEY=your_gemini_api_key
DEBUG=True
SECRET_KEY=your-secret-key

text

2. **Frontend**: Vite dev server runs on `http://localhost:5173/`

3. **Backend**: Django server runs on `http://localhost:8000/`

## 📱 API Endpoints

GET /api/skills/ - List all skills
POST /api/skills/ - Create skill
GET /api/skills/{id}/ - Get single skill
PUT /api/skills/{id}/ - Update skill
DELETE /api/skills/{id}/ - Delete skill
POST /api/skills/{id}/ai-resources/ - Get AI resources
POST /api/skills/{id}/mastery-predict/ - Predict mastery
GET /api/profile/streak/ - Get streak data
POST /api/profile/update-streak/ - Update streak
GET /api/dashboard-stats/ - Dashboard statistics
POST /api/weekly-summary/ - Weekly summary

text

## 👨‍💻 Development Status

**Current Progress:**
- ✅ Backend API Complete
- ✅ Database Models & Serializers
- ✅ Frontend Setup Complete
- ✅ API Service Layer
- 🚧 UI Components (In Progress)
- 🚧 AI Integration (In Progress)
- 📝 Deployment (Pending)

## 📄 License

This project is for educational/interview purposes.

## 👤 Author

**MUHAMMED JASSIM NISAM** - Full Stack Developer
- GitHub: [@jxsim-x](https://github.com/jxsim-x)
- LinkedIn: [MUHAMMED JASSIM NISAM](www.linkedin.com/in/muhammed-jassim-nisam-656973277)

---

**Built for Round 3 Interview - October 2025**