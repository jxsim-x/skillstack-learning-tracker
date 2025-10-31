import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSkill, deleteSkill } from '../services/api';
import AIResources from '../components/AIResources';
import MasteryPredictor from '../components/MasteryPredictor';
import './SkillDetail.css';

function SkillDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkill();
  }, [id]);

  const fetchSkill = async () => {
    try {
      setLoading(true);
      const data = await getSkill(id);
      setSkill(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skill:', err);
      setError('Failed to load skill details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.skill_name}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        await deleteSkill(id);
        navigate('/skills');
      } catch (err) {
        alert('Failed to delete skill. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="skill-detail-container">
        <div className="loading-center">
          <div className="spinner"></div>
          <p className="loading-text">Loading skill details...</p>
        </div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="skill-detail-container">
        <div className="error-center">
          <h2>❌ Error</h2>
          <p>{error || 'Skill not found'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/skills')}>
            Back to Skills
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="skill-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button onClick={() => navigate('/skills')} className="btn btn-outline">
          ← Back to Skills
        </button>
        <div className="header-actions">
          <button onClick={() => navigate(`/edit-skill/${id}`)} className="btn btn-secondary">
            ✏️ Edit
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Skill Info Card */}
      <div className="skill-info-card">
        <div className="skill-header">
          <h1>{skill.skill_name}</h1>
          <span className={`badge badge-${skill.status}`}>
            {skill.status.replace('-', ' ')}
          </span>
        </div>

        <div className="skill-meta-grid">
          <div className="meta-item">
            <span className="meta-label">📺 Resource Type</span>
            <span className="meta-value">{skill.resource_type}</span>
          </div>

          {skill.platform && (
            <div className="meta-item">
              <span className="meta-label">🌐 Platform</span>
              <span className="meta-value">{skill.platform}</span>
            </div>
          )}

          <div className="meta-item">
            <span className="meta-label">📂 Category</span>
            <span className="meta-value">{skill.category}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">⏱️ Hours Spent</span>
            <span className="meta-value">{skill.hours_spent}h</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">💪 Difficulty</span>
            <span className="meta-value">
              {'⭐'.repeat(skill.difficulty_rating)} ({skill.difficulty_rating}/5)
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">📅 Added On</span>
            <span className="meta-value">{formatDate(skill.created_date)}</span>
          </div>
        </div>

        {skill.notes && (
          <div className="skill-notes-section">
            <h3>📝 Notes</h3>
            <p className="notes-content">{skill.notes}</p>
          </div>
        )}
      </div>

      {/* AI Features */}
      <AIResources skillId={skill.id} skillName={skill.skill_name} />
      <MasteryPredictor skillId={skill.id} skillName={skill.skill_name} />
    </div>
  );
}

export default SkillDetail;