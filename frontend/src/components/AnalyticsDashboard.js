// components/AnalyticsDashboard.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AnalyticsDashboard({ scores, domain, onBack, onRestart }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedScores, setAnimatedScores] = useState({ easy: 0, medium: 0, hard: 0 });

  useEffect(() => {
    // Animate scores on component mount
    const animateScores = () => {
      Object.keys(scores).forEach((level, index) => {
        if (scores[level] !== null) {
          setTimeout(() => {
            setAnimatedScores(prev => ({
              ...prev,
              [level]: scores[level]
            }));
          }, index * 500);
        }
      });
    };
    
    animateScores();
  }, [scores]);

  const getPerformanceLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: '#10B981' };
    if (score >= 60) return { level: 'Good', color: '#3B82F6' };
    if (score >= 40) return { level: 'Average', color: '#F59E0B' };
    return { level: 'Needs Improvement', color: '#EF4444' };
  };

  const calculateTotalQuestions = () => {
    return Object.values(scores).filter(score => score !== null).length * 5;
  };

  const calculateCorrectAnswers = () => {
    let total = 0;
    Object.values(scores).forEach(score => {
      if (score !== null) {
        total += Math.round((score / 100) * 5);
      }
    });
    return total;
  };

  const getStrengthsAndWeaknesses = () => {
    const levels = [
      { name: 'Easy', score: scores.easy, threshold: 80 },
      { name: 'Medium', score: scores.medium, threshold: 60 },
      { name: 'Hard', score: scores.hard, threshold: 40 }
    ];

    const strengths = levels.filter(level => 
      level.score !== null && level.score >= level.threshold
    );
    
    const weaknesses = levels.filter(level => 
      level.score !== null && level.score < level.threshold
    );

    return { strengths, weaknesses };
  };

  const { strengths, weaknesses } = getStrengthsAndWeaknesses();

  const TabButton = ({ tab, label, isActive, onClick }) => (
    <button
      className={`tab-button ${isActive ? 'active' : ''}`}
      onClick={() => onClick(tab)}
    >
      {label}
      {isActive && <div className="tab-indicator" />}
    </button>
  );

  const renderOverviewTab = () => (
    <div className="overview-content">
      {/* Performance Summary */}
      <div className="performance-grid">
        {['easy', 'medium', 'hard'].map((level, index) => (
          <div key={level} className="performance-card">
            <div className="card-header">
              <h4>{level.charAt(0).toUpperCase() + level.slice(1)} Level</h4>
              <div className={`difficulty-badge difficulty-${level}`}>
                {level === 'easy' ? '⭐' : level === 'medium' ? '⭐⭐' : '⭐⭐⭐'}
              </div>
            </div>
            
            <div className="score-display">
              <div className="score-circle-small">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${animatedScores[level] || 0}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    style={{
                      stroke: getPerformanceLevel(scores[level]).color,
                      transition: 'stroke-dasharray 1s ease-in-out'
                    }}
                  />
                </svg>
                <div className="score-text">
                  <span className="score-number">{scores[level] || 0}</span>
                  <span className="score-percent">%</span>
                </div>
              </div>
            </div>
            
            <div className="performance-details">
              {scores[level] !== null ? (
                <>
                  <div className="performance-label" style={{ color: getPerformanceLevel(scores[level]).color }}>
                    {getPerformanceLevel(scores[level]).level}
                  </div>
                  <div className="pass-status">
                    <span className={`status-indicator ${
                      (level === 'easy' && scores[level] >= 80) ||
                      (level === 'medium' && scores[level] >= 60) ||
                      (level === 'hard' && scores[level] >= 40)
                        ? 'passed' : 'failed'
                    }`}>
                      {(level === 'easy' && scores[level] >= 80) ||
                       (level === 'medium' && scores[level] >= 60) ||
                       (level === 'hard' && scores[level] >= 40)
                        ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="not-attempted">Not Attempted</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <div className="stat-number">{calculateTotalQuestions()}</div>
            <div className="stat-label">Total Questions</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-number">{calculateCorrectAnswers()}</div>
            <div className="stat-label">Correct Answers</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-number">
              {calculateTotalQuestions() > 0 
                ? Math.round((calculateCorrectAnswers() / calculateTotalQuestions()) * 100)
                : 0}%
            </div>
            <div className="stat-label">Accuracy</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-number">{strengths.length}</div>
            <div className="stat-label">Levels Passed</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="insights-content">
      {/* Strengths Section */}
      <div className="insights-section strengths">
        <h3 className="section-title">
          <span className="section-icon">💪</span>
          Your Strengths
        </h3>
        {strengths.length > 0 ? (
          <div className="strengths-list">
            {strengths.map((strength, index) => (
              <div key={strength.name} className="strength-item">
                <div className="strength-header">
                  <span className="strength-name">{strength.name} Level</span>
                  <span className="strength-score">{strength.score}%</span>
                </div>
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{ 
                      width: `${strength.score}%`,
                      backgroundColor: getPerformanceLevel(strength.score).color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No levels passed yet. Keep practicing!</p>
          </div>
        )}
      </div>

      {/* Areas for Improvement */}
      <div className="insights-section improvements">
        <h3 className="section-title">
          <span className="section-icon">📈</span>
          Areas for Improvement
        </h3>
        {weaknesses.length > 0 ? (
          <div className="improvements-list">
            {weaknesses.map((weakness, index) => (
              <div key={weakness.name} className="improvement-item">
                <div className="improvement-header">
                  <span className="improvement-name">{weakness.name} Level</span>
                  <span className="improvement-score">{weakness.score}%</span>
                </div>
                <div className="improvement-suggestion">
                  {weakness.name === 'Easy' && 
                    "Focus on fundamental concepts and basic problem-solving"}
                  {weakness.name === 'Medium' && 
                    "Practice intermediate topics and build more complex projects"}
                  {weakness.name === 'Hard' && 
                    "Study advanced concepts and work on challenging problems"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state success">
            <p>Great job! You've passed all attempted levels! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="analytics-dashboard">
      <style jsx>{`
        .analytics-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .dashboard-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .back-button {
          background: rgba(103, 126, 234, 0.1);
          border: 1px solid rgba(103, 126, 234, 0.2);
          color: #667eea;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
        }

        .back-button:hover {
          background: rgba(103, 126, 234, 0.2);
          transform: translateY(-2px);
        }

        .header-content {
          text-align: center;
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dashboard-subtitle {
          font-size: 1.125rem;
          color: #64748b;
          margin: 0.5rem 0 0 0;
          font-weight: 500;
        }

        .tab-navigation {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 0.5rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .tab-button {
          flex: 1;
          padding: 1rem 2rem;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .tab-button.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 8px 25px rgba(103, 126, 234, 0.3);
        }

        .tab-button:hover:not(.active) {
          background: rgba(103, 126, 234, 0.1);
          color: #667eea;
        }

        .tab-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 2rem;
        }

        .performance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .performance-card {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .performance-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .card-header h4 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
        }

        .difficulty-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .difficulty-easy {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .difficulty-medium {
          background: rgba(59, 130, 246, 0.1);
          color: #2563eb;
        }

        .difficulty-hard {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .score-display {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .score-circle-small {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .circular-chart {
          width: 100%;
          height: 100%;
        }

        .circle-bg {
          fill: none;
          stroke: rgba(203, 213, 225, 0.3);
          stroke-width: 3.8;
        }

        .circle {
          fill: none;
          stroke-width: 3.8;
          stroke-linecap: round;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }

        .score-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .score-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2d3748;
        }

        .score-percent {
          font-size: 1rem;
          color: #64748b;
          font-weight: 500;
        }

        .performance-details {
          text-align: center;
        }

        .performance-label {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .status-indicator {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-indicator.passed {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .status-indicator.failed {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .not-attempted {
          color: #64748b;
          font-style: italic;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          font-size: 1.5rem;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .insights-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .insights-content {
            grid-template-columns: 1fr;
          }
        }

        .insights-section {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 1.5rem 0;
        }

        .section-icon {
          font-size: 1.5rem;
        }

        .strength-item, .improvement-item {
          margin-bottom: 1.5rem;
        }

        .strength-header, .improvement-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .strength-name, .improvement-name {
          font-weight: 600;
          color: #2d3748;
        }

        .strength-score, .improvement-score {
          font-weight: 700;
          font-size: 0.875rem;
        }

        .strength-bar {
          height: 8px;
          background: rgba(203, 213, 225, 0.3);
          border-radius: 4px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: width 1s ease-in-out;
          border-radius: 4px;
        }

        .improvement-suggestion {
          font-size: 0.875rem;
          color: #64748b;
          font-style: italic;
          margin-top: 0.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #64748b;
        }

        .empty-state.success {
          color: #059669;
        }

        .dashboard-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .action-button {
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .action-button.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #667eea;
          border: 1px solid rgba(103, 126, 234, 0.2);
        }

        .action-button.secondary:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .action-button.primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 10px 25px rgba(103, 126, 234, 0.3);
        }

        .action-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(103, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .analytics-dashboard {
            padding: 1rem;
          }
          
          .performance-grid {
            grid-template-columns: 1fr;
          }
          
          .quick-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .dashboard-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Summary
        </motion.button>
        
        <div className="header-content">
          <h2 className="dashboard-title">Performance Analytics</h2>
          <p className="dashboard-subtitle">{domain} Domain Assessment</p>
        </div>
      </div>

      <div className="tab-navigation">
        <TabButton
          tab="overview"
          label="Overview"
          isActive={activeTab === 'overview'}
          onClick={setActiveTab}
        />
        <TabButton
          tab="insights"
          label="Insights"
          isActive={activeTab === 'insights'}
          onClick={setActiveTab}
        />
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'insights' && renderInsightsTab()}
      </div>

      <div className="dashboard-actions">
        <button className="action-button secondary" onClick={onBack}>
          View Summary
        </button>
        <button className="action-button primary" onClick={onRestart}>
          Start New Interview
        </button>
      </div>
    </div>
  );
}