import { useState, useEffect } from 'react';
import { getStreak } from '../services/api';
import './StreakWidget.css';

function StreakWidget() {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMilestone, setShowMilestone] = useState(false);

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      const data = await getStreak();
      setStreakData(data);
      
      // Show milestone popup if exists
      if (data.milestone_message) {
        setShowMilestone(true);
        // Auto-hide after 8 seconds
        setTimeout(() => setShowMilestone(false), 8000);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streak:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="streak-widget loading">
        <div className="spinner-small"></div>
      </div>
    );
  }

  if (!streakData) {
    return null;
  }

  return (
    <>
      {/* Main Streak Widget */}
      <div className="streak-widget">
        {/* Flame Icon with Animation */}
        <div className="flame-container">
          <div className="flame">🔥</div>
        </div>

        {/* Streak Info */}
        <div className="streak-info">
          <div className="current-streak">
            <span className="streak-number">{streakData.current_streak}</span>
            <span className="streak-label">Day Streak</span>
          </div>
          
          <div className="streak-details">
            <div className="detail-item">
              <span className="detail-label">🏆 Best:</span>
              <span className="detail-value">{streakData.longest_streak} days</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📅 Total:</span>
              <span className="detail-value">{streakData.total_learning_days} days</span>
            </div>
          </div>

          <p className="streak-motivator">
            {streakData.current_streak > 0 
              ? "🎯 Don't break the chain!" 
              : "🚀 Start your streak today!"}
          </p>
        </div>
      </div>

      {/* Milestone Popup */}
      {showMilestone && streakData.milestone_message && (
        <div className="milestone-popup">
          <div className="milestone-content">
            <button 
              className="milestone-close"
              onClick={() => setShowMilestone(false)}
            >
              ✕
            </button>
            <div className="milestone-badge">
              {streakData.milestone_message.badge}
            </div>
            <h3>Milestone Achieved! 🎉</h3>
            <p className="milestone-message">
              {streakData.milestone_message.message}
            </p>
            <div className="milestone-streak">
              Day {streakData.current_streak} 🔥
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StreakWidget;