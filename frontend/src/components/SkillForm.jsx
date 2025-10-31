import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSkill, updateSkill, updateStreak } from '../services/api';
import './SkillForm.css';

function SkillForm({ skillData = null, isEditMode = false }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    skill_name: '',
    resource_type: 'video',
    platform: '',
    status: 'started',
    hours_spent: 0,
    difficulty_rating: 3,
    notes: '',
    category: 'other',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && skillData) {
      setFormData({
        skill_name: skillData.skill_name || '',
        resource_type: skillData.resource_type || 'video',
        platform: skillData.platform || '',
        status: skillData.status || 'started',
        hours_spent: skillData.hours_spent || 0,
        difficulty_rating: skillData.difficulty_rating || 3,
        notes: skillData.notes || '',
        category: skillData.category || 'other',
      });
    }
  }, [isEditMode, skillData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.skill_name.trim()) {
      newErrors.skill_name = 'Skill name is required';
    }
    
    if (formData.hours_spent < 0) {
      newErrors.hours_spent = 'Hours cannot be negative';
    }
    
    if (formData.difficulty_rating < 1 || formData.difficulty_rating > 5) {
      newErrors.difficulty_rating = 'Difficulty must be between 1 and 5';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (isEditMode && skillData) {
        await updateSkill(skillData.id, formData);
        console.log('✅ Skill updated successfully!');
      } else {
        await createSkill(formData);
        console.log('✅ Skill created successfully!');
        
        try {
          await updateStreak();
          console.log('✅ Streak updated!');
        } catch (streakError) {
          console.error('Streak update failed, but skill created:', streakError);
        }
      }
      
      navigate('/skills');
      
    } catch (err) {
      console.error('❌ Error saving skill:', err);
      setError(err.response?.data?.message || 'Failed to save skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/skills');
  };

  return (
    <div className="skill-form-container">
      <div className="skill-form-card">
        <h2>{isEditMode ? 'Edit Skill' : 'Add New Skill'}</h2>
        
        {/* Error Message */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="skill-form">
          {/* Skill Name */}
          <div className="form-group">
            <label htmlFor="skill_name" className="form-label">
              Skill Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="skill_name"
              name="skill_name"
              value={formData.skill_name}
              onChange={handleChange}
              className={`form-input ${errors.skill_name ? 'error' : ''}`}
              placeholder="e.g., React Hooks, Python Django"
              disabled={loading}
            />
            {errors.skill_name && (
              <span className="field-error">{errors.skill_name}</span>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="form-row">
            {/* Resource Type */}
            <div className="form-group">
              <label htmlFor="resource_type" className="form-label">
                Resource Type
              </label>
              <select
                id="resource_type"
                name="resource_type"
                value={formData.resource_type}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="video">Video</option>
                <option value="course">Course</option>
                <option value="article">Article</option>
              </select>
            </div>

            {/* Platform */}
            <div className="form-group">
              <label htmlFor="platform" className="form-label">
                Platform
              </label>
              <input
                type="text"
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., YouTube, Udemy"
                disabled={loading}
              />
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="form-row">
            {/* Status */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="started">Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="data">Data</option>
                <option value="devops">DevOps</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="form-row">
            {/* Hours Spent */}
            <div className="form-group">
              <label htmlFor="hours_spent" className="form-label">
                Hours Spent
              </label>
              <input
                type="number"
                id="hours_spent"
                name="hours_spent"
                value={formData.hours_spent}
                onChange={handleChange}
                className={`form-input ${errors.hours_spent ? 'error' : ''}`}
                step="0.5"
                min="0"
                disabled={loading}
              />
              {errors.hours_spent && (
                <span className="field-error">{errors.hours_spent}</span>
              )}
            </div>

            {/* Difficulty Rating */}
            <div className="form-group">
              <label htmlFor="difficulty_rating" className="form-label">
                Difficulty (1-5)
              </label>
              <select
                id="difficulty_rating"
                name="difficulty_rating"
                value={formData.difficulty_rating}
                onChange={handleChange}
                className={`form-select ${errors.difficulty_rating ? 'error' : ''}`}
                disabled={loading}
              >
                <option value="1">1 - Very Easy</option>
                <option value="2">2 - Easy</option>
                <option value="3">3 - Medium</option>
                <option value="4">4 - Hard</option>
                <option value="5">5 - Very Hard</option>
              </select>
              {errors.difficulty_rating && (
                <span className="field-error">{errors.difficulty_rating}</span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Add any notes, thoughts, or learnings..."
              rows="4"
              disabled={loading}
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{isEditMode ? 'Update Skill' : 'Add Skill'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SkillForm;