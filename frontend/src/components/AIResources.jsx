import { useState } from 'react';
import { getAIResources } from '../services/api';
import './AIResources.css';

function AIResources({ skillId, skillName }) {
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAIResources(skillId);
      setResources(response.resources);
      setLoading(false);
    } catch (err) {
      console.error('Error getting AI resources:', err);
      setError('Failed to get recommendations. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="ai-resources">
      <h3>🤖 AI-Powered Learning Resources</h3>
      
      {!resources && !loading && (
        <button 
          onClick={handleGetResources}
          className="btn btn-primary"
        >
          ✨ Get Smart Recommendations
        </button>
      )}

      {loading && (
        <div className="ai-loading">
          <div className="spinner"></div>
          <p>Gemini AI is finding the best resources for {skillName}...</p>
        </div>
      )}

      {error && (
        <div className="ai-error">
          ❌ {error}
        </div>
      )}

      {resources && (
        <div className="resources-container">
          {/* YouTube Videos */}
          {resources.videos && resources.videos.length > 0 && (
            <div className="resource-section">
              <h4>📺 YouTube Tutorials</h4>
              <ul className="resource-list">
                {resources.videos.map((video, index) => {
                const [title, url] = video.split(' - ');
                return (
                    <div key={index} className="resource-item">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="resource-link">
                        ▶️ {title}
                    </a>
                    </div>
                );
                })}
              </ul>
            </div>
          )}

          {/* Documentation */}
          {resources.documentation && resources.documentation.length > 0 && (
            <div className="resource-section">
              <h4>📚 Documentation & Guides</h4>
              <ul className="resource-list">
                {resources.documentation.map((doc, index) => {
            const [title, url] = doc.split(' - ');
            return (
              <li key={index} className="resource-item">
                <a href={url} target="_blank" rel="noopener noreferrer" className="resource-link">
                  📄 {title}
                </a>
              </li>
            );
          })}
              </ul>
            </div>
          )}

          {/* Courses */}
          {resources.courses && resources.courses.length > 0 && (
            <div className="resource-section">
              <h4>🎓 Online Courses</h4>
              <ul className="resource-list">
                {resources.courses.map((course, index) => {
            const [title, url] = course.split(' - ');
            return (
              <li key={index} className="resource-item">
                <a href={url} target="_blank" rel="noopener noreferrer" className="resource-link">
                  🎯 {title}
                </a>
              </li>
            );
          })}
              </ul>
            </div>
          )}

          <button 
            onClick={handleGetResources}
            className="btn btn-outline btn-small"
          >
            🔄 Regenerate Recommendations
          </button>
        </div>
      )}
    </div>
  );
}

export default AIResources;