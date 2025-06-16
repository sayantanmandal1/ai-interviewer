// Interview.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "./components/QuestionCard";
import ResultsCard from "./components/ResultsCard";
import LoadingScreen from "./components/LoadingScreen";
import Timer from "./components/Timer";
import FinalSummary from "./components/FinalSummary";
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
  const [level, setLevel] = useState("easy");
  const [scores, setScores] = useState({ easy: null, medium: null, hard: null });
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const TIMER_DURATION = 30; // configurable timer duration in seconds

  useEffect(() => {
    if (level === "easy" && questions.length === 0 && !result) {
      fetchQuestions("easy");
    }
  }, [domain, level, questions.length, result]);

  useEffect(() => {
    if (questions.length > 0 && !result) {
      startTimer();
    }
  }, [current, questions]);

  function startTimer() {
    setTimeLeft(TIMER_DURATION);
    setTimerActive(true);
    setQuestionStartTime(Date.now());
  }

  function handleTimeUp() {
    setTimerActive(false);
    // Mark as unanswered if no answer provided
    if (!answers[current]?.user_answer || answers[current]?.user_answer.trim() === "") {
      handleAnswerChange("UNANSWERED - Time ran out");
    }
    // Auto proceed to next question
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelectedOption(null);
      } else {
        submitAnswers();
      }
    }, 1000);
  }

  function fetchQuestions(levelType) {
    setLoading(true);
    axios
      .post("https://ai-interviewer-67b9.onrender.com/start", { domain, level: levelType })
      .then((res) => {
        setSessionId(res.data.session_id);
        setQuestions(res.data.questions || []);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load questions.");
        setLoading(false);
      });
  }

  function handleAnswerChange(value) {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[current] = {
        id: questions[current]?.id ?? current,
        type: questions[current]?.type ?? "",
        user_answer: value,
        time_taken: questionStartTime ? (Date.now() - questionStartTime) / 1000 : 0,
        answered_within_time: timerActive
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
    
    setTimerActive(false);
    
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelectedOption(null);
    } else {
      submitAnswers();
    }
  }

  async function submitAnswers() {
    setIsSubmitting(true);
    setLoading(true);
    setTimerActive(false);
    
    const formattedAnswers = answers.map((a) => ({
      id: a.id,
      type: a.type.toLowerCase(),
      user_answer: a.user_answer,
      time_taken: a.time_taken,
      answered_within_time: a.answered_within_time
    }));

    try {
      const res = await axios.post("https://ai-interviewer-67b9.onrender.com/evaluate", {
        session_id: sessionId,
        answers: formattedAnswers,
      });
      
      setResult(res.data);
      
      // Send email to HR if this is the final evaluation
      if (level === "hard" || res.data.result === "Failed") {
        await sendEmailToHR(res.data, formattedAnswers);
      }
      
      setLoading(false);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Evaluation error:", err.response?.data || err);
      alert("Failed to evaluate answers");
      setLoading(false);
      setIsSubmitting(false);
    }
  }

  async function sendEmailToHR(evaluationResult, userAnswers) {
    try {
      const emailData = {
        to: "msayantan06@gmail.com",
        subject: `Interview Evaluation Report - ${domain} Domain`,
        html: generateEmailReport(evaluationResult, userAnswers)
      };

      // This would typically be sent to your backend to handle email sending
      await axios.post("https://ai-interviewer-67b9.onrender.com/send-email", emailData);
      setEmailSent(true);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  function generateEmailReport(evaluationResult, userAnswers) {
    const timestamp = new Date().toLocaleString();
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea; text-align: center;">Interview Evaluation Report</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Candidate Information</h3>
          <p><strong>Domain:</strong> ${domain}</p>
          <p><strong>Date:</strong> ${timestamp}</p>
          <p><strong>Final Score:</strong> ${evaluationResult.score?.toFixed(1) || 'N/A'}/100</p>
          <p><strong>Result:</strong> ${evaluationResult.result || 'Failed'}</p>
        </div>
        
        <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
          <h3>Level Performance</h3>
          <ul>
            <li>Easy Level: ${scores.easy || 'N/A'}</li>
            <li>Medium Level: ${scores.medium || 'N/A'}</li>
            <li>Hard Level: ${scores.hard || 'N/A'}</li>
          </ul>
        </div>
        
        <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px; margin-top: 20px;">
          <h3>Detailed Answers</h3>
          ${userAnswers.map((answer, index) => `
            <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
              <p><strong>Question ${index + 1}:</strong></p>
              <p><strong>Answer:</strong> ${answer.user_answer}</p>
              <p><strong>Time Taken:</strong> ${answer.time_taken?.toFixed(1) || 'N/A'}s</p>
              <p><strong>Within Time Limit:</strong> ${answer.answered_within_time ? 'Yes' : 'No'}</p>
            </div>
          `).join('')}
        </div>
        
        <p style="text-align: center; color: #666; margin-top: 30px;">
          Generated automatically by AI Interviewer System
        </p>
      </div>
    `;
  }

  if (loading) {
    return (
    <AnimatePresence mode="wait">
      {loading && <LoadingScreen isSubmitting={isSubmitting} key="loading-screen" />}
    </AnimatePresence>
  );
  }

  if (result) {
    return (
      <ResultsCard
        result={result}
        level={level}
        scores={scores}
        emailSent={emailSent}
        onNextLevel={() => {
          const currentScore = result.score;
          setScores((prev) => ({ ...prev, [level]: currentScore }));

          if (level === "easy" && currentScore >= 50) {
            setLevel("medium");
            fetchQuestions("medium");
          } else if (level === "medium" && currentScore >= 50) {
            setLevel("hard");
            fetchQuestions("hard");
          } else {
            setLevel("final");
          }

          setResult(null);
          setAnswers([]);
          setCurrent(0);
          setSelectedOption(null);
          setEmailSent(false);
        }}
      />
    );
  }

  if (level === "final") {
    return <FinalSummary scores={scores} domain={domain} onRestart={onRestart} />;
  }

  if (!questions.length) {
    return (
      <div className="no-questions">
        <h3>No questions found.</h3>
      </div>
    );
  }

  const question = questions[current];
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

      <Timer 
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        timerActive={timerActive}
        onTimeUp={handleTimeUp}
        duration={TIMER_DURATION}
      />

      <QuestionCard
        question={question}
        current={current}
        answers={answers}
        selectedOption={selectedOption}
        onAnswerChange={handleAnswerChange}
        onOptionSelect={handleOptionSelect}
        onNext={nextQuestion}
        isLastQuestion={current + 1 === questions.length}
        timerActive={timerActive}
      />
    </motion.div>
  );
}