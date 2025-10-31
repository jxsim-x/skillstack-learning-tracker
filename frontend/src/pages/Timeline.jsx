import { useState, useEffect } from 'react';
import { getAllSkills } from '../services/api';
import './Timeline.css';

function Timeline() {
  const [skills, setSkills] = useState([]);
  const [groupedSkills, setGroupedSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (skills.length > 0) {
      groupSkillsByTime();
    }
  }, [skills]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await getAllSkills();
      // Sort by created_date, newest first
      const sorted = data.sort((a, b) => 
        new Date(b.created_date) - new Date(a.created_date)
      );
      setSkills(sorted);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load timeline');
      setLoading(false);
    }
  };

  const groupSkillsByTime = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const groups = {
      today: [],
      thisWeek: [],
      earlier: []
    };

    skills.forEach(skill => {
      const skillDate = new Date(skill.created_date);
      skillDate.setHours(0, 0, 0, 0);

      if (skillDate.getTime() === today.getTime()) {
        groups.today.push(skill);
      } else if (skillDate >= oneWeekAgo) {
        groups.thisWeek.push(skill);
      } else {
        groups.earlier.push(skill);
      }
    });

    setGroupedSkills(groups);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    const colors = {
      'started': '#3b82f6',
      'in-progress': '#f59e0b',
      'completed': '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  const TimelineItem = ({ skill, showDate = true }) => (
    <div className="timeline-item">
      <div className="timeline-dot" style={{ backgroundColor: getStatusColor(skill.status) }}></div>
      <div className="timeline-content">
        <div className="timeline-header">
          <h3 className="timeline-skill-name">{skill.skill_name}</h3>
          {showDate && (
            <span className="timeline-date">{formatDate(skill.created_date)}</span>
          )}
        </div>
        <div className="timeline-details">
          <span className={`badge badge-${skill.status}`}>
            {skill.status.replace('-', ' ')}
          </span>
          <span className="timeline-meta">📂 {skill.category}</span>
          <span className="timeline-meta">⏱️ {skill.hours_spent}h</span>
          <span className="timeline-meta">
            {'⭐'.repeat(skill.difficulty_rating)}
          </span>
        </div>
        {skill.platform && (
          <p className="timeline-platform">🌐 {skill.platform}</p>
        )}
        {skill.notes && (
          <p className="timeline-notes">
            📝 {skill.notes.substring(0, 150)}
            {skill.notes.length > 150 ? '...' : ''}
          </p>
        )}
      </div>
    </div>
  );

    const TimelineSection = ({ title, skills, icon }) => {
    // Check if skills exists AND has length before accessing
    if (!skills || skills.length === 0) return null;
    
    return (
        <div className="timeline-section">
        <h2 className="timeline-section-title">
            <span className="section-icon">{icon}</span>
            {title}
            <span className="section-count">({skills.length})</span>
        </h2>
        <div className="timeline-list">
            {skills.map(skill => (
            <TimelineItem key={skill.id} skill={skill} />
            ))}
        </div>
    </div>
    );
    };

  if (loading) {
    return (
      <div className="timeline-container">
        <div className="loading-center">
          <div className="spinner"></div>
          <p className="loading-text">Loading your timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="timeline-container">
        <div className="error-center">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchSkills}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="timeline-container">
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h2>No Learning Activities Yet</h2>
          <p>Your learning timeline will appear here as you add skills.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      {/* Header */}
      <div className="timeline-header-section">
        <h1>Learning Timeline</h1>
        <p className="subtitle">
          Your chronological learning journey - {skills.length} activities
        </p>
      </div>

      {/* Timeline */}
      <div className="timeline-wrapper">
        <TimelineSection 
          title="Today" 
          skills={groupedSkills.today} 
          icon="🌟" 
        />
        <TimelineSection 
          title="This Week" 
          skills={groupedSkills.thisWeek} 
          icon="📅" 
        />
        <TimelineSection 
          title="Earlier" 
          skills={groupedSkills.earlier} 
          icon="📚" 
        />
      </div>
    </div>
  );
}

export default Timeline;