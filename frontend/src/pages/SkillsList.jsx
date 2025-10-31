import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSkills, deleteSkill } from '../services/api';
import SkillCard from '../components/SkillCard';
import './SkillsList.css';

function SkillsList() {
  const navigate = useNavigate();
  
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [skills, statusFilter, categoryFilter, searchQuery]);


  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSkills();
      setSkills(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again.');
      setLoading(false);
    }
  };


  const applyFilters = () => {
    let filtered = [...skills];


    if (statusFilter !== 'all') {
      filtered = filtered.filter(skill => skill.status === statusFilter);
    }


    if (categoryFilter !== 'all') {
      filtered = filtered.filter(skill => skill.category === categoryFilter);
    }


    if (searchQuery.trim()) {
      filtered = filtered.filter(skill =>
        skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSkills(filtered);
  };


  const handleDelete = async (id) => {
    try {
      await deleteSkill(id);
      console.log('✅ Skill deleted successfully!');
      

      setSkills(skills.filter(skill => skill.id !== id));
      
    } catch (err) {
      console.error('Error deleting skill:', err);
      alert('Failed to delete skill. Please try again.');
    }
  };


  if (loading) {
    return (
      <div className="skills-list-container">
        <div className="loading-center">
          <div className="spinner"></div>
          <p className="loading-text">Loading your skills...</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="skills-list-container">
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
      <div className="skills-list-container">
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h2>No Skills Yet!</h2>
          <p>Start your learning journey by adding your first skill.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/add-skill')}
          >
            ➕ Add Your First Skill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="skills-list-container">

      <div className="skills-header">
        <div>
          <h1>My Skills</h1>
          <p className="subtitle">
            {skills.length} {skills.length === 1 ? 'skill' : 'skills'} in your learning journey
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/add-skill')}
        >
          ➕ Add New Skill
        </button>
      </div>


      <div className="filters-container">

        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
          />
        </div>


        <div className="filter-group">
          <label className="filter-label">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="started">Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>


        <div className="filter-group">
          <label className="filter-label">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select filter-select"
          >
            <option value="all">All Categories</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="data">Data</option>
            <option value="devops">DevOps</option>
            <option value="other">Other</option>
          </select>
        </div>


        {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setStatusFilter('all');
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="btn btn-outline btn-small"
          >
            ✕ Clear Filters
          </button>
        )}
      </div>


      <div className="results-info">
        {filteredSkills.length === skills.length ? (
          <p>Showing all {skills.length} skills</p>
        ) : (
          <p>
            Showing {filteredSkills.length} of {skills.length} skills
          </p>
        )}
      </div>


      {filteredSkills.length === 0 ? (
        <div className="no-results">
          <h3>No skills match your filters</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="skills-grid">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SkillsList;