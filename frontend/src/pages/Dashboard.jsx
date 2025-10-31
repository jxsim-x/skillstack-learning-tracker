import { useState, useEffect } from 'react';
import { getDashboardStats, getWeeklySummary } from '../services/api';
import StreakWidget from '../components/StreakWidget';
import StatsCard from '../components/StatsCard';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  // Pie Chart Data - Skills by Category
  const getPieChartData = () => {
    if (!stats || !stats.skills_by_category) return null;

    const colors = {
      frontend: '#3b82f6',
      backend: '#10b981',
      data: '#8b5cf6',
      devops: '#f59e0b',
      other: '#6b7280',
    };

    return {
      labels: stats.skills_by_category.map(item => 
        item.category.charAt(0).toUpperCase() + item.category.slice(1)
      ),
      datasets: [{
        data: stats.skills_by_category.map(item => item.count),
        backgroundColor: stats.skills_by_category.map(item => colors[item.category] || '#6b7280'),
        borderWidth: 2,
        borderColor: '#ffffff',
      }],
    };
  };

  // Bar Chart Data - Top Skills by Hours
  const getBarChartData = () => {
    if (!stats || !stats.top_skills) return null;

    return {
      labels: stats.top_skills.map(skill => skill.skill_name),
      datasets: [{
        label: 'Hours Spent',
        data: stats.top_skills.map(skill => skill.hours_spent),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
      }],
    };
  };

  // Chart Options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.x} hours`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

   const handleWeeklySummary = async () => {
    setSummaryLoading(true);
    try {
      const data = await getWeeklySummary();
      setWeeklySummary(data);
      setSummaryLoading(false);
    } catch (err) {
      console.error('Error getting weekly summary:', err);
      setSummaryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-center">
          <div className="spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-center">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchDashboardStats}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Track your learning progress and achievements</p>
        </div>
        <button 
          onClick={handleWeeklySummary}
          className="btn btn-primary"
          disabled={summaryLoading}
        >
          {summaryLoading ? '⏳ Generating...' : '📊 Weekly Summary'}
        </button>
      </div>


    {/* Weekly Summary Display -*/}
      {weeklySummary && (
        <div className="weekly-summary-card">
          <h3>📊 This Week's Learning Summary</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-value">{weeklySummary.stats.skills_added}</span>
              <span className="stat-label">Skills Added</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">{weeklySummary.stats.hours_logged}</span>
              <span className="stat-label">Hours Logged</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">{weeklySummary.stats.completed_this_week}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="ai-message">
            <span className="message-icon">🤖</span>
            <p>{weeklySummary.ai_message}</p>
          </div>
          <button 
            onClick={() => setWeeklySummary(null)}
            className="btn btn-outline btn-small"
          >
            ✕ Close
          </button>
        </div>
      )}


      {/* Streak Widget - Full Width */}
      <StreakWidget />

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <StatsCard
          icon="📚"
          title="Total Skills"
          value={stats.total_skills}
          subtitle="Learning resources"
          color="blue"
        />
        <StatsCard
          icon="✅"
          title="Completed"
          value={stats.completed_skills}
          subtitle={`${stats.completion_percentage}% completion rate`}
          color="green"
        />
        <StatsCard
          icon="⏱️"
          title="Total Hours"
          value={stats.total_hours}
          subtitle="Time invested"
          color="purple"
        />
        <StatsCard
          icon="🔥"
          title="Current Streak"
          value={stats.current_streak}
          subtitle="Days of consistency"
          color="orange"
        />
      </div>

      {/* Charts Section */}
      {stats.skills_by_category && stats.skills_by_category.length > 0 && (
        <div className="charts-section">
          <h2>Learning Analytics</h2>
          
          <div className="charts-grid">
            {/* Pie Chart */}
            <div className="chart-card">
              <h3>Skills by Category</h3>
              <div className="chart-container">
                <Pie data={getPieChartData()} options={pieOptions} />
              </div>
            </div>

            {/* Bar Chart */}
            {stats.top_skills && stats.top_skills.length > 0 && (
              <div className="chart-card">
                <h3>Top Skills by Hours</h3>
                <div className="chart-container">
                  <Bar data={getBarChartData()} options={barOptions} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State for Charts */}
      {(!stats.skills_by_category || stats.skills_by_category.length === 0) && (
        <div className="empty-charts">
          <p>📊 Add more skills to see analytics charts</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;