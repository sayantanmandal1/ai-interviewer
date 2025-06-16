import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnalyticsDashboard from "./AnalyticsDashboard";

// Embedded styles object
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    backgroundImage: `
      radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)
    `,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },

  resultsContainer: {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1
  },

  finalSummaryCard: {
    background: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative'
  },

  celebrating: {
    transform: 'scale(1.02)',
    boxShadow: '0 25px 80px rgba(102, 126, 234, 0.15), 0 15px 35px rgba(118, 75, 162, 0.1)'
  },

  gradientHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '3rem 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    position: 'relative',
    overflow: 'hidden'
  },

  gradientHeaderBefore: {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3
  },

  gradeCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    zIndex: 2
  },

  'grade-a': {
    border: '3px solid #10b981',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)'
  },

  'grade-b': {
    border: '3px solid #3b82f6',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)'
  },

  'grade-c': {
    border: '3px solid #f59e0b',
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)'
  },

  'grade-fail': {
    border: '3px solid #ef4444',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)'
  },

  gradeLetter: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#2c3e50',
    lineHeight: '1',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },

  gradeScore: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#64748b',
    marginTop: '0.25rem'
  },

  headerText: {
    flex: 1,
    color: '#ffffff',
    zIndex: 2,
    position: 'relative'
  },

  summaryTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },

  domainLabel: {
    fontSize: '1.125rem',
    fontWeight: '500',
    opacity: 0.9,
    margin: 0
  },

  statusCard: {
    margin: '2rem',
    padding: '1.5rem',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'all 0.3s ease'
  },

  passed: {
    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    border: '2px solid #10b981',
    color: '#065f46'
  },

  failed: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    border: '2px solid #f59e0b',
    color: '#92400e'
  },

  statusContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: '100%'
  },

  statusIcon: {
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(5px)'
  },

  statusText: {
    flex: 1
  },

  statusTextH3: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 0.25rem 0'
  },

  statusTextP: {
    fontSize: '1rem',
    margin: 0,
    opacity: 0.8
  },

  performanceCard: {
    margin: '0 2rem 2rem',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderRadius: '16px',
    border: '1px solid #cbd5e1',
    textAlign: 'center'
  },

  performanceMessage: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#475569',
    margin: 0,
    lineHeight: 1.6
  },

  scoreSection: {
    padding: '0 2rem 2rem'
  },

  sectionTitle: {
    fontSize: '1.375rem',
    fontWeight: '700',
    color: '#334155',
    margin: '0 0 1.5rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },

  scoreGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
  },

  scoreCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    border: '2px solid transparent',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },

  levelPassed: {
    borderColor: '#10b981',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
  },

  levelFailed: {
    borderColor: '#ef4444',
    background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)'
  },

  levelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  },

  levelEmoji: {
    fontSize: '1.5rem'
  },

  levelName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#374151',
    flex: 1
  },

  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  statusBadgePassed: {
    background: '#10b981',
    color: '#ffffff'
  },

  statusBadgeFailed: {
    background: '#ef4444',
    color: '#ffffff'
  },

  notAttempted: {
    background: '#6b7280',
    color: '#ffffff'
  },

  scoreDisplay: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },

  scoreNumber: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#1f2937',
    lineHeight: '1'
  },

  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  progressBar: {
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative'
  },

  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },

  'level-easy': {
    background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
  },

  'level-medium': {
    background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)'
  },

  'level-hard': {
    background: 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'
  },

  threshold: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontWeight: '500'
  },

  recommendationsSection: {
    padding: '0 2rem 2rem'
  },

  recommendationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem'
  },

  recommendationCard: {
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    transition: 'all 0.3s ease',
    cursor: 'default'
  },

  recommendationCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
  },

  recommendationText: {
    fontSize: '0.9375rem',
    color: '#475569',
    fontWeight: '500',
    lineHeight: 1.5
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    margin: '0 2rem 2rem',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '16px',
    border: '1px solid #e2e8f0'
  },

  statCard: {
    textAlign: 'center',
    padding: '1rem',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.3s ease'
  },

  statCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
  },

  statNumber: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: '900',
    color: '#1f2937',
    lineHeight: '1'
  },

  statLabel: {
    display: 'block',
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500',
    marginTop: '0.5rem'
  },

  actionSection: {
    padding: '0 2rem 2rem'
  },

  actionButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },

  analyticsButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
    minWidth: '180px',
    justifyContent: 'center'
  },

  restartButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    minWidth: '180px',
    justifyContent: 'center'
  },

  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
  },

  footerSection: {
    padding: '1.5rem 2rem 2rem',
    borderTop: '1px solid #e2e8f0',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
  },

  completionBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    fontSize: '0.875rem',
    color: '#374151',
    fontWeight: '500'
  },

  celebrationOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1000
  },

  confetti: {
    position: 'absolute',
    width: '8px',
    height: '8px',
    background: `linear-gradient(45deg, 
      #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, 
      #ffd93d, #6c5ce7, #fd79a8, #00b894
    )`,
    borderRadius: '2px'
  }
};

export default function FinalSummary({ scores, domain, onRestart }) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const passed = (scores.easy ?? 0) >= 80 || (scores.medium ?? 0) >= 60 || (scores.hard ?? 0) >= 40;

  const getOverallGrade = () => {
    if (scores.hard && scores.hard >= 40) return "A";
    if (scores.medium && scores.medium >= 60) return "B";
    if (scores.easy && scores.easy >= 80) return "C";
    return "Fail";
  };

  const getPerformanceMessage = () => {
    const grade = getOverallGrade();
    const messages = {
      A: "🌟 Outstanding performance! You've demonstrated exceptional expertise and mastery.",
      B: "👏 Impressive performance! You have strong knowledge and solid understanding.",
      C: "✨ Good foundation! You're on the right track with solid basics.",
      Fail: "🚀 Great effort! Every expert was once a beginner - keep pushing forward!"
    };
    return messages[grade] || messages.Fail;
  };

  const getRecommendations = () => {
    const grade = getOverallGrade();
    const recommendations = {
      A: [
        "🎯 Share your expertise through mentoring and teaching",
        "📚 Explore cutting-edge developments and emerging technologies",
        "🏆 Pursue leadership roles and complex project ownership",
        "🌍 Contribute to open-source projects and tech communities"
      ],
      B: [
        "💪 Challenge yourself with advanced problem-solving scenarios",
        "🔬 Deep-dive into specialized areas of interest",
        "🛠️ Build comprehensive real-world applications",
        "📜 Pursue relevant certifications to validate expertise"
      ],
      C: [
        "🏗️ Strengthen core concepts through structured practice",
        "⚡ Solve daily coding challenges to build muscle memory",
        "📖 Follow comprehensive learning paths and tutorials",
        "🔨 Create hands-on projects to apply theoretical knowledge"
      ],
      Fail: [
        "🌱 Begin with fundamentals and build step by step",
        "📚 Enroll in structured courses with clear progression",
        "⏰ Establish daily practice routines with simple exercises",
        "🤝 Connect with mentors and join supportive communities"
      ]
    };
    return recommendations[grade] || recommendations.Fail;
  };

  const calculateOverallScore = () => {
    const validScores = Object.values(scores).filter(score => score !== null && score !== undefined);
    if (validScores.length === 0) return 0;
    return Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length);
  };

  const getLevelEmoji = (level) => {
    const emojis = { easy: "🟢", medium: "🟡", hard: "🔴" };
    return emojis[level] || "⚪";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      if (passed) {
        setCelebrationActive(true);
        setTimeout(() => setCelebrationActive(false), 3000);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [passed]);

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
    <div style={styles.pageWrapper}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={styles.resultsContainer}
      >
        <motion.div
          style={{
            ...styles.finalSummaryCard,
            ...(celebrationActive ? styles.celebrating : {})
          }}
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <div style={styles.gradientHeader}>
            <div style={{
              ...styles.gradeCircle,
              ...styles[`grade-${getOverallGrade().toLowerCase()}`]
            }}>
              <span style={styles.gradeLetter}>{getOverallGrade()}</span>
              <div style={styles.gradeScore}>{calculateOverallScore()}%</div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={styles.headerText}
            >
              <h1 style={styles.summaryTitle}>Assessment Complete</h1>
              <p style={styles.domainLabel}>{domain} Technical Interview</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              ...styles.statusCard,
              ...(passed ? styles.passed : styles.failed)
            }}
          >
            <div style={styles.statusContent}>
              <div style={styles.statusIcon}>
                {passed ? "🎉" : "🌟"}
              </div>
              <div style={styles.statusText}>
                <h3 style={styles.statusTextH3}>{passed ? "Congratulations!" : "Keep Going!"}</h3>
                <p style={styles.statusTextP}>{passed ? "You've successfully passed the assessment" : "Every step forward is progress"}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            style={styles.performanceCard}
          >
            <p style={styles.performanceMessage}>{getPerformanceMessage()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            style={styles.scoreSection}
          >
            <h3 style={styles.sectionTitle}>📊 Performance Breakdown</h3>
            <div style={styles.scoreGrid}>
              {['easy', 'medium', 'hard'].map((levelKey, index) => {
                const score = scores[levelKey];
                const thresholds = { easy: 80, medium: 60, hard: 40 };
                const levelPassed = score >= thresholds[levelKey];
                
                return (
                  <motion.div
                    key={levelKey}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + index * 0.15 }}
                    style={{
                      ...styles.scoreCard,
                      ...(levelPassed ? styles.levelPassed : styles.levelFailed)
                    }}
                  >
                    <div style={styles.levelHeader}>
                      <span style={styles.levelEmoji}>{getLevelEmoji(levelKey)}</span>
                      <span style={styles.levelName}>{levelKey.toUpperCase()}</span>
                      <div style={{
                        ...styles.statusBadge,
                        ...(score !== null ? (levelPassed ? styles.statusBadgePassed : styles.statusBadgeFailed) : styles.notAttempted)
                      }}>
                        {score !== null ? (levelPassed ? '✓ PASSED' : '✗ RETRY') : 'SKIPPED'}
                      </div>
                    </div>
                    
                    <div style={styles.scoreDisplay}>
                      <div style={styles.scoreNumber}>
                        {score !== null ? `${score.toFixed(0)}%` : "—"}
                      </div>
                      <div style={styles.progressContainer}>
                        <div style={styles.progressBar}>
                          <motion.div
                            style={{
                              ...styles.progressFill,
                              ...styles[`level-${levelKey}`]
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: score !== null ? `${Math.min(score, 100)}%` : "0%" }}
                            transition={{ delay: 1.8 + index * 0.15, duration: 1.2, ease: "easeOut" }}
                          />
                        </div>
                        <span style={styles.threshold}>Target: {thresholds[levelKey]}%</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
            style={styles.recommendationsSection}
          >
            <h3 style={styles.sectionTitle}>💡 Next Steps & Recommendations</h3>
            <div style={styles.recommendationGrid}>
              {getRecommendations().map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.3 + index * 0.1 }}
                  style={{
                    ...styles.recommendationCard,
                    ...(hoveredCard === `rec-${index}` ? styles.recommendationCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard(`rec-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <span style={styles.recommendationText}>{recommendation}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.7 }}
            style={styles.statsGrid}
          >
            <div 
              style={{
                ...styles.statCard,
                ...(hoveredCard === 'stat1' ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredCard('stat1')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span style={styles.statNumber}>{Object.values(scores).filter(score => score !== null).length}</span>
              <span style={styles.statLabel}>Levels Completed</span>
            </div>
            <div 
              style={{
                ...styles.statCard,
                ...(hoveredCard === 'stat2' ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredCard('stat2')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span style={styles.statNumber}>{calculateOverallScore()}%</span>
              <span style={styles.statLabel}>Overall Score</span>
            </div>
            <div 
              style={{
                ...styles.statCard,
                ...(hoveredCard === 'stat3' ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredCard('stat3')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span style={styles.statNumber}>{getOverallGrade()}</span>
              <span style={styles.statLabel}>Final Grade</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9 }}
            style={styles.actionSection}
          >
            <div style={styles.actionButtons}>
              <motion.button 
                style={{
                  ...styles.analyticsButton,
                  ...(hoveredCard === 'analytics' ? styles.buttonHover : {})
                }}
                onClick={() => setShowAnalytics(true)}
                onMouseEnter={() => setHoveredCard('analytics')}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={!animationComplete}
              >
                <span>📈</span>
                <span>Detailed Analytics</span>
              </motion.button>
              
              <motion.button 
                style={{
                  ...styles.restartButton,
                  ...(hoveredCard === 'restart' ? styles.buttonHover : {})
                }}
                onClick={onRestart}
                onMouseEnter={() => setHoveredCard('restart')}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>🚀</span>
                <span>New Assessment</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.1 }}
            style={styles.footerSection}
          >
            <div style={styles.completionBadge}>
              <span>🏁 Assessment Completed</span>
              <time>{new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</time>
            </div>
          </motion.div>
        </motion.div>

        {celebrationActive && (
          <div style={styles.celebrationOverlay}>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  ...styles.confetti,
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d', '#6c5ce7', '#fd79a8', '#00b894'][i % 8]
                }}
                initial={{ opacity: 1, y: -100, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200) }}
                animate={{ opacity: 0, y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100, rotate: 360 }}
                transition={{ duration: 3, delay: Math.random() * 0.5 }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}