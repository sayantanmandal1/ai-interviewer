// components/Timer.js
import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function Timer({ timeLeft, setTimeLeft, timerActive, onTimeUp, duration }) {
  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, setTimeLeft, onTimeUp]);

  const progress = (timeLeft / duration) * 100;
  const isWarning = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <motion.div 
      className={`timer-container ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="timer-display">
        <motion.div 
          className="timer-circle"
          animate={isCritical ? { 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 0 0 rgba(239, 68, 68, 0.7)",
              "0 0 0 10px rgba(239, 68, 68, 0)",
              "0 0 0 0 rgba(239, 68, 68, 0)"
            ]
          } : {}}
          transition={{ duration: 1, repeat: isCritical ? Infinity : 0 }}
        >
          <svg className="timer-svg" viewBox="0 0 36 36">
            <path
              className="timer-track"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              className="timer-progress"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              strokeDasharray={`${progress}, 100`}
              initial={{ strokeDasharray: "100, 100" }}
              animate={{ strokeDasharray: `${progress}, 100` }}
              transition={{ duration: 0.3 }}
            />
          </svg>
          <div className="timer-text">
            <span className="timer-number">{timeLeft}</span>
            <span className="timer-label">sec</span>
          </div>
        </motion.div>
      </div>
      
      <div className="timer-info">
        <span className="timer-status">
          {timerActive ? (
            isWarning ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ⚠️ Time running out!
              </motion.span>
            ) : (
              "⏰ Time remaining"
            )
          ) : (
            "⏸️ Timer paused"
          )}
        </span>
      </div>
    </motion.div>
  );
}