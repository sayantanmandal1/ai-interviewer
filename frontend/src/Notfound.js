// NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <button onClick={() => navigate("/login")} style={styles.button}>
        Go Back to Login
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "auto",
    padding: 40,
    borderRadius: 12,
    background: "#f9fafb",
    boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
    textAlign: "center",
    marginTop: "10vh",
  },
  title: {
    fontSize: 32,
    color: "#4B5563",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
  },
};
