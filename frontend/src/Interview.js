import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Interview({ domain, onRestart }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

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
    handleAnswerChange(option);
  }

  function nextQuestion() {
    if (!answers[current]?.user_answer || answers[current]?.user_answer.trim() === "") {
      alert("Please answer the question before proceeding.");
      return;
    }
    if (current + 1 < questions.length) setCurrent(current + 1);
    else submitAnswers();
  }

  function submitAnswers() {
    setLoading(true);
    const formattedAnswers = answers.map((a) => ({
      id: a.id,  // Ensure it's int or string
      type: a.type.toLowerCase(),  // Ensure it matches exactly
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
      })
      .catch((err) => {
        console.error("Evaluation error:", err.response?.data || err);
        alert("Failed to evaluate answers");
        setLoading(false);
      });
  }


  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h3>Loading...</h3>
      </div>
    );

  if (result)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: "center" }}
      >
        <h2>Interview Complete</h2>
        <h3>
          Score: {result.score?.toFixed(2) ?? "0"} / 100 —{" "}
          <span
            style={{
              color: result.result === "Passed" ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {result.result ?? "Failed"}
          </span>
        </h3>
        <button
          onClick={() => {
            setResult(null);
            setAnswers([]);
            setCurrent(0);
            onRestart();
          }}
          style={{
            marginTop: 30,
            padding: "10px 30px",
            fontSize: 18,
            backgroundColor: "#4f46e5",
            color: "white",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
        >
          Restart Interview
        </button>
      </motion.div>
    );

  if (!questions.length)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h3>No questions found.</h3>
      </div>
    );

  const question = questions[current];
  console.log("Current question:", question);

  const questionType = question?.type?.toLowerCase() || "";

  return (
    <motion.div
      key={current}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <h3>
        Question {current + 1} / {questions.length}
      </h3>
      <p style={{ fontSize: 20, margin: "20px 0" }}>
        {question?.question?.trim() || "No question text available."}
      </p>

      {questionType === "mcq" ? (
        <div>
          {(question.options && question.options.length > 0) ? (
            question.options.map((opt, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <label>
                  <input
                    type="radio"
                    name={`q${current}`}
                    value={opt}
                    checked={answers[current]?.user_answer === opt}
                    onChange={() => handleOptionSelect(opt)}
                  />{" "}
                  {opt}
                </label>
              </div>
            ))
          ) : (
            <p>No options available for this MCQ.</p>
          )}
        </div>
      ) : (
        <textarea
          rows={5}
          value={answers[current]?.user_answer || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          style={{ width: "100%", fontSize: 16, padding: 10, borderRadius: 6 }}
          placeholder="Type your answer here..."
        />
      )}

      <button
        onClick={nextQuestion}
        style={{
          marginTop: 20,
          padding: "10px 30px",
          fontSize: 18,
          backgroundColor: "#4f46e5",
          color: "white",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
        }}
      >
        {current + 1 === questions.length ? "Submit" : "Next"}
      </button>
    </motion.div>
  );
}
