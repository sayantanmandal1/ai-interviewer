// components/QuestionCard.js
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuestionCard({
  question,
  current,
  answers,
  selectedOption,
  onAnswerChange,
  onOptionSelect,
  onNext,
  isLastQuestion,
  timerActive
}) {
  const questionType = question?.type?.toLowerCase() || "";

  return (
    <motion.div
      className="question-card"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="question-header">
        <div className="question-type-badge">
          {questionType === "mcq" ? "Multiple Choice" : "Text Answer"}
        </div>
      </div>

      <h3 className="question-text">
        {question?.question?.trim() || "No question text available."}
      </h3>

      <div className="answer-section">
        {questionType === "mcq" ? (
          <div className="mcq-options">
            {question.options && Object.keys(question.options).length > 0 ? (
              <AnimatePresence>
                {Object.entries(question.options).map(([key, value], i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`option-item ${
                      answers[current]?.user_answer === key ? "selected" : ""
                    } ${!timerActive ? "disabled" : ""}`}
                    onClick={() => timerActive && onOptionSelect(key)}
                    whileHover={timerActive ? { scale: 1.02 } : {}}
                    whileTap={timerActive ? { scale: 0.98 } : {}}
                  >
                    <div className="option-radio">
                      <motion.div
                        className="radio-inner"
                        initial={false}
                        animate={{
                          scale: answers[current]?.user_answer === key ? 1 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </div>
                    <span className="option-text">
                      <strong>{key.toUpperCase()}.</strong> {value}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <p className="no-options">No options available for this MCQ.</p>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-answer-container"
          >
            <textarea
              rows={5}
              value={answers[current]?.user_answer || ""}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="text-answer"
              placeholder={timerActive ? "Type your detailed answer here..." : "Time's up! Answer locked."}
              disabled={!timerActive}
            />
            <div className="textarea-footer">
              <span className="char-count">
                {answers[current]?.user_answer?.length || 0} characters
              </span>
              {!timerActive && (
                <span className="timer-expired">⏰ Time expired</span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="next-button"
        disabled={
          (!answers[current]?.user_answer ||
          answers[current]?.user_answer.trim() === "") && timerActive
        }
      >
        <span>
          {isLastQuestion ? "Submit Interview" : "Next Question"}
        </span>
        <motion.div
          className="button-arrow"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          →
        </motion.div>
      </motion.button>
    </motion.div>
  );
}