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
    // Assuming each level has 5 questions
    return Object.values(scores).filter(score => score !== null).length * 5;
  };

  const calculateCorrectAnswers = () => {
    let total = 0;
    Object.values(scores).forEach(score => {
      if (score !== null) {
        total += Math.round((score / 100) * 5); // Assuming 5 questions per level
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
    <motion.button
      className={`tab-button ${isActive ? 'active' : ''}`}
      onClick={() => onClick(tab)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
      {isActive && (
        <motion.div
          className="tab-indicator"
          layoutId="tab-indicator"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );

  const renderOverviewTab = () => (
    <div className="overview-content">
      {/* Performance Summary */}
      <div className="performance-grid">
        {['easy', 'medium', 'hard'].map((level, index) => (
          <motion.div
            key={level}
            className="performance-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
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
                  <motion.path
                    className="circle"
                    strokeDasharray={`${animatedScores[level] || 0}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${animatedScores[level] || 0}, 100` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
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
                  <div className="performance-label">
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
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        className="quick-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
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
      </motion.div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="insights-content">
      {/* Strengths Section */}
      <motion.div
        className="insights-section strengths"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="section-title">
          <span className="section-icon">💪</span>
          Your Strengths
        </h3>
        {strengths.length > 0 ? (
          <div className="strengths-list">
            {strengths.map((strength, index) => (
              <motion.div
                key={strength.name}
                className="strength-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="strength-header">
                  <span className="strength-name">{strength.name} Level</span>
                  <span className="strength-score">{strength.score}%</span>
                </div>
                <div className="strength-bar">
                  <motion.div
                    className="strength-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${strength.score}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No levels passed yet. Keep practicing!</p>
          </div>
        )}
      </motion.div>

      {/* Areas for Improvement */}
      <motion.div
        className="insights-section improvements"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="section-title">
          <span className="section-icon">📈</span>
          Areas for Improvement
        </h3>
        {weaknesses.length > 0 ? (
          <div className="improvements-list">
            {weaknesses.map((weakness, index) => (
              <motion.div
                key={weakness.name}
                className="improvement-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
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
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state success">
            <p>Great job! You've passed all attempted levels! 🎉</p>
          </div>
        )}
      </motion.div>
    </div>
  );

  return (
    <motion.div
      className="analytics-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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

      <motion.div
        className="dashboard-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <button className="action-button secondary" onClick={onBack}>
          View Summary
        </button>
        <button className="action-button primary" onClick={onRestart}>
          Start New Interview
        </button>
      </motion.div>
    </motion.div>
  );
}