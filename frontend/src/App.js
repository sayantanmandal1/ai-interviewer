import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./Login";
import Register from "./Register";
import DomainSelect from "./DomainSelect";
import Interview from "./Interview";
import NotFound from "./Notfound"; // 404 Page Component

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/domain" />} />
        <Route
          path="/login"
          element={!user ? <LoginRedirect /> : <Navigate to="/domain" />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterRedirect /> : <Navigate to="/domain" />}
        />
        <Route
          path="/domain"
          element={
            <ProtectedRoute user={user}>
              <DomainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/:domain"
          element={
            <ProtectedRoute user={user}>
              <InterviewPage />
            </ProtectedRoute>
          }
        />
        <Route path="/interview" element={<Navigate to="/login" />} />

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// 🔒 Wrapper to protect private routes
function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" />;
}

// Redirect helper to pass switch callbacks
function LoginRedirect() {
  const navigate = useNavigate();
  return <Login switchToRegister={() => navigate("/register")} />;
}

function RegisterRedirect() {
  const navigate = useNavigate();
  return <Register switchToLogin={() => navigate("/login")} />;
}

// Domain selection page
function DomainPage() {
  const navigate = useNavigate();

  const handleDomainSelect = (domain) => {
    navigate(`/interview/${domain}`);
  };

  return (
    <PageWrapper>
      <DomainSelect onSelectDomain={handleDomainSelect} />
    </PageWrapper>
  );
}

// Interview page with "Back" navigation
function InterviewPage() {
  const { domain } = useParams();
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <button
        style={{ ...styles.navButton, alignSelf: "flex-start", marginBottom: 10 }}
        onClick={() => navigate("/domain")}
      >
        ← Back to Domain Selection
      </button>
      <Interview domain={domain} resetDomain={() => navigate("/domain")} />
    </PageWrapper>
  );
}

// Shared wrapper with logout header
function PageWrapper({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
      {children}
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
  navButton: {
    backgroundColor: "#e5e7eb",
    color: "#111827",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "500",
    fontSize: 14,
  },
};
