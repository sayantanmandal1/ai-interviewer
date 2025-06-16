// components/LoadingScreen.js
import React from "react";
import { motion } from "framer-motion";

export default function LoadingScreen({ isSubmitting = false }) {
  const loadingMessages = {
    default: [
      "Loading questions...",
      "Preparing your interview...",
      "Setting up the environment...",
      "Almost ready..."
    ],
    submitting: [
      "Evaluating your answers...",
      "Analyzing your performance...",
      "Calculating your score...",
      "Preparing your results...",
      "Sending report to HR..."
    ]
  };

  const messages = isSubmitting ? loadingMessages.submitting : loadingMessages.default;
  const [currentMessage, setCurrentMessage] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="loading-screen"
    >
      <div className="loading-content">
        {/* Animated Logo/Icon */}
        <motion.div
          className="loading-icon"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="icon-inner">
            {isSubmitting ? "📊" : "🤖"}
          </div>
        </motion.div>

        {/* Loading Spinner */}
        <div className="spinner-container">
          <motion.div
            className="spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </motion.div>
        </div>

        {/* Dynamic Loading Message */}
        <motion.div
          className="loading-message"
          key={currentMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h3>{messages[currentMessage]}</h3>
        </motion.div>

        {/* Progress Dots */}
        <div className="loading-dots">
          {messages.map((_, index) => (
            <motion.div
              key={index}
              className={`dot ${index === currentMessage ? 'active' : ''}`}
              animate={index === currentMessage ? {
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          ))}
        </div>


        {/* Additional Info */}
        <motion.div
          className="loading-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="loading-subtitle">
            {isSubmitting 
              ? "Please wait while we process your interview..."
              : "Preparing your personalized interview experience..."
            }
          </p>
        </motion.div>

        {/* Floating Particles */}
        <div className="particles">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [-20, -100, -20],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={{
                left: `${20 + i * 12}%`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          overflow: hidden;
        }

        .loading-content {
          text-align: center;
          color: white;
          position: relative;
          z-index: 2;
        }

        .loading-icon {
          font-size: 4rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-inner {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .spinner-container {
          position: relative;
          margin: 2rem 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .spinner {
          width: 60px;
          height: 60px;
          position: relative;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top: 3px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
        }

        .spinner-ring:nth-child(1) {
          animation: spin 2s linear infinite;
        }

        .spinner-ring:nth-child(2) {
          animation: spin 1.5s linear infinite reverse;
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          border-top-color: rgba(255, 255, 255, 0.6);
        }

        .spinner-ring:nth-child(3) {
          animation: spin 1s linear infinite;
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          border-top-color: rgba(255, 255, 255, 0.4);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-message {
          margin: 2rem 0;
        }

        .loading-message h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin: 1.5rem 0;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .dot.active {
          background: white;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        }



        .loading-info {
          margin-top: 2rem;
        }

        .loading-subtitle {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          top: 100%;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .loading-icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
          }

          .icon-inner {
            width: 100px;
            height: 100px;
            font-size: 2.5rem;
          }

          .loading-message h3 {
            font-size: 1.25rem;
          }

          .progress-container {
            width: 250px;
          }

          .loading-subtitle {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </motion.div>
  );
}