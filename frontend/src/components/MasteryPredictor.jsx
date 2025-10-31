import { useState } from 'react';
import { getMasteryPrediction } from '../services/api';
import './MasteryPredictor.css';

function MasteryPredictor({ skillId, skillName }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetPrediction = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMasteryPrediction(skillId);
      setPrediction(response.prediction)
      setLoading(false);
    } catch (err) {
      console.error('Error getting mastery prediction:', err);
      setError('Failed to generate prediction. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="mastery-predictor">
      <h3>🎯 Mastery Prediction</h3>
      
      {!prediction && !loading && (
        <button 
          onClick={handleGetPrediction}
          className="btn btn-secondary"
        >
          🔮 Predict Mastery Timeline
        </button>
      )}

      {loading && (
        <div className="prediction-loading">
          <div className="spinner"></div>
          <p>AI is analyzing your progress for {skillName}...</p>
        </div>
      )}

      {error && (
        <div className="prediction-error">
          ❌ {error}
        </div>
      )}

      {prediction && (
        <div className="prediction-container">
          {/* Completion Estimate */}
          <div className="prediction-card">
            <div className="prediction-highlight">
              <span className="prediction-value">
                {prediction.estimated_weeks} weeks
              </span>
              <span className="prediction-label">to master</span>
            </div>
            
            <div className="prediction-detail">
              <span>📊 Total hours needed:</span>
              <strong>{prediction.estimated_total_hours}h</strong>
            </div>
            
            <div className="prediction-detail">
              <span>✅ Current progress:</span>
              <strong>{prediction.completion_percentage}%</strong>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${prediction.completion_percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Acceleration Tips */}
          {prediction.tips && prediction.tips.length > 0 && (
            <div className="prediction-section">
              <h4>💡 Acceleration Tips</h4>
              <ul className="tips-list">
                {prediction.tips.map((tip, index) => (
                  <li key={index} className="tip-item">
                    <span className="tip-number">{index + 1}</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Tools */}
          {prediction.ai_tools && prediction.ai_tools.length > 0 && (
            <div className="prediction-section">
              <h4>🤖 Recommended AI Tools</h4>
              <div className="ai-tools">
                {prediction.ai_tools.map((tool, index) => (
                  <span key={index} className="tool-badge">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={handleGetPrediction}
            className="btn btn-outline btn-small"
          >
            🔄 Regenerate Prediction
          </button>
        </div>
      )}
    </div>
  );
}

export default MasteryPredictor;