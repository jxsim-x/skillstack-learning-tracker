import { useNavigate } from 'react-router-dom';
import './SkillCard.css';

function SkillCard({ skill, onDelete }) {
  const navigate = useNavigate();


  const handleEdit = (e) => {
    e.stopPropagation(); 
    navigate(`/edit-skill/${skill.id}`);
  };


  const handleDelete = (e) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.skill_name}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      onDelete(skill.id);
    }
  };

    const handleCardClick = () => {
    navigate(`/skill/${skill.id}`);
  };


  const getStatusClass = (status) => {
    return `badge badge-${status}`;
  };


  const renderDifficultyStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="skill-card" onClick={handleCardClick} style={{cursor: 'pointer'}}>
      {/* Card Header */}
      <div className="skill-card-header">
        <h3 className="skill-name">{skill.skill_name}</h3>
        <span className={getStatusClass(skill.status)}>
          {skill.status.replace('-', ' ')}
        </span>
      </div>

      {/* Card Body */}
      <div className="skill-card-body">
        {/* Resource Type & Platform */}
        <div className="skill-info">
          <span className="info-label">📺 Resource:</span>
          <span className="info-value">{skill.resource_type}</span>
        </div>

        {skill.platform && (
          <div className="skill-info">
            <span className="info-label">🌐 Platform:</span>
            <span className="info-value">{skill.platform}</span>
          </div>
        )}

        {/* Category */}
        <div className="skill-info">
          <span className="info-label">📂 Category:</span>
          <span className="info-value">{skill.category}</span>
        </div>

        {/* Hours Spent */}
        <div className="skill-info">
          <span className="info-label">⏱️ Hours:</span>
          <span className="info-value">{skill.hours_spent}h</span>
        </div>

        {/* Difficulty */}
        <div className="skill-info">
          <span className="info-label">💪 Difficulty:</span>
          <span className="info-value">
            {renderDifficultyStars(skill.difficulty_rating)}
          </span>
        </div>

        {/* Notes Preview */}
        {skill.notes && (
          <div className="skill-notes">
            <span className="info-label">📝 Notes:</span>
            <p className="notes-text">
              {skill.notes.length > 100
                ? `${skill.notes.substring(0, 100)}...`
                : skill.notes}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer - Actions */}
      <div className="skill-card-footer">
        <button onClick={handleEdit} className="btn btn-secondary btn-small">
          ✏️ Edit
        </button>
        <button onClick={handleDelete} className="btn btn-danger btn-small">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default SkillCard;