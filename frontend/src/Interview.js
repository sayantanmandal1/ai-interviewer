import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./Interview.css";

export default function Interview({ domain, onRestart }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .post("http://127.0.0.1:8000/start", { domain })
      .then((res) => {
        console.log("Start response:", res.data);
        setSessionId(res.data.session_id);
        setQuestions(res.data.questions || []);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load questions.");
        setLoading(false);
      });
  }, [domain]);

  function handleAnswerChange(value) {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[current] = {
        id: questions[current]?.id ?? current,
        type: questions[current]?.type ?? "",
        user_answer: value,
      };
      return newAnswers;
    });
  }

  function handleOptionSelect(option) {
    setSelectedOption(option);
    handleAnswerChange(option);
  }

  function nextQuestion() {
    if (!answers[current]?.user_answer || answers[current]?.user_answer.trim() === "") {
      alert("Please answer the question before proceeding.");
      return;
    }
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelectedOption(null);
    } else {
      submitAnswers();
    }
  }

  function submitAnswers() {
    setIsSubmitting(true);
    setLoading(true);
    const formattedAnswers = answers.map((a) => ({
      id: a.id,
      type: a.type.toLowerCase(),
      user_answer: a.user_answer,
    }));

    axios
      .post("http://127.0.0.1:8000/evaluate", {
        session_id: sessionId,
        answers: formattedAnswers,
      })
      .then((res) => {
        setResult(res.data);
        setLoading(false);
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.error("Evaluation error:", err.response?.data || err);
        alert("Failed to evaluate answers");
        setLoading(false);
        setIsSubmitting(false);
      });
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="loading-text"
        >
          {isSubmitting ? "Evaluating your answers..." : "Loading questions..."}
        </motion.h3>
        <motion.div
          className="loading-progress"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    );
  }

  // Results Screen
  if (result) {
    const isPassed = result.result === "Passed";
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
            <div className="score-value">{result.score?.toFixed(0) ?? "0"}</div>
            <div className="score-label">/ 100</div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="results-title"
          >
            Interview Complete
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`result-status ${isPassed ? "passed" : "failed"}`}
          >
            {result.result ?? "Failed"}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={() => {
              setResult(null);
              setAnswers([]);
              setCurrent(0);
              setSelectedOption(null);
              onRestart();
            }}
            className="restart-button"
          >
            <span>Start New Interview</span>
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // No Questions
  if (!questions.length) {
    return (
      <div className="no-questions">
        <h3>No questions found.</h3>
      </div>
    );
  }

  const question = questions[current];
  const questionType = question?.type?.toLowerCase() || "";
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <motion.div
      key={current}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="interview-container"
    >
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-info">
          <span className="question-counter">
            Question {current + 1} of {questions.length}
          </span>
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
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

        {/* Answer Section */}
        <div className="answer-section">
          {questionType === "mcq" ? (
            <div className="mcq-options">
              {(question.options && question.options.length > 0) ? (
                <AnimatePresence>
                  {question.options.map((opt, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`option-item ${
                        answers[current]?.user_answer === opt ? "selected" : ""
                      }`}
                      onClick={() => handleOptionSelect(opt)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="option-radio">
                        <motion.div
                          className="radio-inner"
                          initial={false}
                          animate={{
                            scale: answers[current]?.user_answer === opt ? 1 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </div>
                      <span className="option-text">{opt}</span>
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
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="text-answer"
                placeholder="Type your detailed answer here..."
              />
              <div className="textarea-footer">
                <span className="char-count">
                  {answers[current]?.user_answer?.length || 0} characters
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextQuestion}
          className="next-button"
          disabled={!answers[current]?.user_answer || answers[current]?.user_answer.trim() === ""}
        >
          <span>{current + 1 === questions.length ? "Submit Interview" : "Next Question"}</span>
          <motion.div
            className="button-arrow"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}