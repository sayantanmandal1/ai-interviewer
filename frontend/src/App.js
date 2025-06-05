import React, { useState, useEffect } from "react";
import Interview from "./Interview";
import DomainSelect from "./DomainSelect";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  const [domain, setDomain] = useState(null);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setDomain(null);
    });
    return unsubscribe;
  }, []);

  if (!user) {
    return showRegister ? (
      <Register switchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login switchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.button} onClick={() => signOut(auth)}>
          Logout
        </button>
      </div>

      {!domain ? (
        <DomainSelect onDomainSelect={setDomain} />
      ) : (
        <Interview domain={domain} resetDomain={() => setDomain(null)} />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "auto",
    background: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 16,
    transition: "background-color 0.3s ease",
  },
};
