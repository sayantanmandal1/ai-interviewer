// components/FinalSummary.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default function FinalSummary({ scores, domain, onRestart }) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const passed =
    (scores.easy ?? 0) >= 80 ||
    (scores.medium ?? 0) >= 60 ||
    (scores.hard ?? 0) >= 40;

  const getOverallGrade = () => {
    if (scores.hard && scores.hard >= 40) return "A";
    if (scores.medium && scores.medium >= 60) return "B";
    if (scores.easy && scores.easy >= 80) return "C";
    return "F";
  };

  const getPerformanceMessage = () => {
    const grade = getOverallGrade();
    switch (grade) {
      case "A": return "Outstanding performance! You've demonstrated excellent expertise.";
      case "B": return "Good performance! You have solid knowledge in this domain.";
      case "C": return "Decent performance! You have basic understanding of the domain.";
      default: return "Keep practicing! There's room for improvement.";
    }
  };

  const getRecommendations = () => {
    const grade = getOverallGrade();
    const recommendations = {
      A: [
        "Consider mentoring others in this domain",
        "Look into advanced topics and specializations",
        "Apply for senior-level positions",
        "Contribute to open-source projects"
      ],
      B: [
        "Practice more complex problem-solving scenarios",
        "Deepen your understanding of advanced concepts",
        "Work on real-world projects",
        "Consider additional certifications"
      ],
      C: [
        "Focus on strengthening fundamental concepts",
        "Practice regularly with coding challenges",
        "Take additional courses or tutorials",
        "Build more hands-on projects"
      ],
      F: [
        "Start with basic concepts and fundamentals",
        "Take structured learning courses",
        "Practice daily with simple exercises",
        "Seek mentorship or guidance"
      ]
    };
    return recommendations[grade] || recommendations.F;
  };

  const calculateOverallScore = () => {
    const validScores = Object.values(scores).filter(score => score !== null && score !== undefined);
    if (validScores.length === 0) return 0;
    return Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showAnalytics) {
    return (
      <AnalyticsDashboard 
        scores={scores}
        domain={domain}
        onBack={() => setShowAnalytics(false)}
        onRestart={onRestart}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="results-container final-summary"
    >
      <motion.div
        className="final-summary-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Header Section */}
        <div className="summary-header">
          <motion.div
            className={`grade-circle grade-${getOverallGrade().toLowerCase()}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <span className="grade-letter">{getOverallGrade()}</span>
            <div className="grade-score">{calculateOverallScore()}%</div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="summary-title"
          >
            Final Interview Results
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="domain-label"
          >
            {domain} Domain Assessment
          </motion.p>
        </div>

        {/* Status Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className={`final-status ${passed ? "passed" : "failed"}`}
        >
          <div className="status-icon">
            {passed ? "🎉" : "😔"}
          </div>
          <div className="status-text">
            {passed ? "Congratulations! You Passed!" : "Keep Learning! You'll Get There!"}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="performance-message"
        >
          {getPerformanceMessage()}
        </motion.p>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="score-breakdown-container"
        >
          <h3 className="breakdown-title">Performance Breakdown</h3>
          <div className="score-breakdown">
            {['easy', 'medium', 'hard'].map((levelKey, index) => (
              <motion.div
                key={levelKey}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7 + index * 0.2 }}
                className="score-item"
              >
                <div className="level-info">
                  <span className="level-name">
                    {levelKey.charAt(0).toUpperCase() + levelKey.slice(1)} Level
                  </span>
                  <div className="score-bar-container">
                    <div className="score-bar">
                      <motion.div
                        className={`score-fill level-${levelKey}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((scores[levelKey] || 0), 100)}%` }}
                        transition={{ delay: 2 + index * 0.2, duration: 1 }}
                      />
                    </div>
                    <span className="score-value">
                      {scores[levelKey] ? `${scores[levelKey].toFixed(0)}%` : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="level-status">
                  {scores[levelKey] ? (
                    <span className={`status-badge ${
                      (levelKey === 'easy' && scores[levelKey] >= 80) ||
                      (levelKey === 'medium' && scores[levelKey] >= 60) ||
                      (levelKey === 'hard' && scores[levelKey] >= 40)
                        ? 'passed' : 'failed'
                    }`}>
                      {(levelKey === 'easy' && scores[levelKey] >= 80) ||
                       (levelKey === 'medium' && scores[levelKey] >= 60) ||
                       (levelKey === 'hard' && scores[levelKey] >= 40)
                        ? 'Passed' : 'Failed'}
                    </span>
                  ) : (
                    <span className="status-badge not-attempted">Not Attempted</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3 }}
          className="recommendations-section"
        >
          <h3 className="recommendations-title">Recommendations for Improvement</h3>
          <div className="recommendations-list">
            {getRecommendations().map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.5 + index * 0.1 }}
                className="recommendation-item"
              >
                <span className="recommendation-bullet">•</span>
                <span className="recommendation-text">{recommendation}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="action-buttons"
        >
          <motion.button 
            className="analytics-button"
            onClick={() => setShowAnalytics(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!animationComplete}
          >
            <span>📊</span>
            View Detailed Analytics
          </motion.button>
          
          <motion.button 
            className="restart-button primary"
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🔄</span>
            Start New Interview
          </motion.button>
        </motion.div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="additional-stats"
        >
          <div className="stat-item">
            <span className="stat-label">Levels Completed:</span>
            <span className="stat-value">
              {Object.values(scores).filter(score => score !== null).length}/3
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Overall Grade:</span>
            <span className={`stat-value grade-${getOverallGrade().toLowerCase()}`}>
              {getOverallGrade()}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Domain:</span>
            <span className="stat-value">{domain}</span>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
          className="summary-footer"
        >
          <p className="footer-text">
            Thank you for taking the AI Interview Assessment. 
            {passed ? " Well done!" : " Keep practicing and you'll improve!"}
          </p>
          <div className="footer-timestamp">
            Completed on: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}