// components/ResultsCard.js
import React from "react";
import { motion } from "framer-motion";

export default function ResultsCard({ result, level, scores, emailSent, onNextLevel }) {
  const isPassed = result.result === "Passed";
  const currentScore = result.score;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="results-container"
    >
      <motion.div
        className="results-card"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className={`score-circle ${isPassed ? "passed" : "failed"}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <div className="score-value">{currentScore?.toFixed(0) ?? "0"}</div>
          <div className="score-label">/ 100</div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="results-title"
        >
          Interview Level: {level.charAt(0).toUpperCase() + level.slice(1)}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`result-status ${isPassed ? "passed" : "failed"}`}
        >
          {result.result ?? "Failed"}
        </motion.div>

        {emailSent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="email-notification"
          >
            <div className="email-icon">📧</div>
            <span>Evaluation report sent to HR</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="level-progress"
        >
          <div className="progress-levels">
            <div className={`level-dot ${scores.easy !== null ? 'completed' : ''} ${level === 'easy' ? 'current' : ''}`}>
              <span>Easy</span>
              {scores.easy && <div className="score-badge">{scores.easy.toFixed(0)}</div>}
            </div>
            <div className="progress-line"></div>
            <div className={`level-dot ${scores.medium !== null ? 'completed' : ''} ${level === 'medium' ? 'current' : ''}`}>
              <span>Medium</span>
              {scores.medium && <div className="score-badge">{scores.medium.toFixed(0)}</div>}
            </div>
            <div className="progress-line"></div>
            <div className={`level-dot ${scores.hard !== null ? 'completed' : ''} ${level === 'hard' ? 'current' : ''}`}>
              <span>Hard</span>
              {scores.hard && <div className="score-badge">{scores.hard.toFixed(0)}</div>}
            </div>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          onClick={onNextLevel}
          className="restart-button"
        >
          <span>
            {level === "hard" || result.result === "Failed"
              ? "View Final Result"
              : "Next Level"}
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}