import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSkill } from '../services/api';
import SkillForm from '../components/SkillForm';

function EditSkill() {
  const { id } = useParams(); // Get skill ID from URL
  const navigate = useNavigate();
  
  const [skillData, setSkillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch skill data when component mounts
    const fetchSkill = async () => {
      try {
        setLoading(true);
        const data = await getSkill(id);
        setSkillData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching skill:', err);
        setError('Failed to load skill data');
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner"></div>
        <p className="loading-text">Loading skill data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/skills')}>
          Back to Skills
        </button>
      </div>
    );
  }

  return (
    <div>
      <SkillForm skillData={skillData} isEditMode={true} />
    </div>
  );
}

export default EditSkill;