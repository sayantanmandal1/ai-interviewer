import React, { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    background:
      "linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f0fdff 100%)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  cardWrapper: {
    width: "100%",
    maxWidth: "28rem",
  },
  card: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    borderRadius: "1.5rem",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    padding: "2rem",
    marginBottom: "1.5rem",
  },
  header: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  iconContainer: {
    width: "4rem",
    height: "4rem",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    borderRadius: "50%",
    margin: "0 auto 1rem auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
  },
  title: {
    fontSize: "1.875rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "0.5rem",
    margin: 0,
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "1rem",
    margin: 0,
  },
  errorContainer: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "0.75rem",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1.5rem",
    animation: "pulse 2s infinite",
  },
  formContainer: {
    marginBottom: "1.5rem",
  },
  fieldContainer: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    paddingLeft: "3rem",
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    border: "2px solid #e5e7eb",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.2s ease-in-out",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: "#10b981",
    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
  },
  inputIcon: {
    position: "absolute",
    left: "1rem",
    top: "0.875rem",
    width: "1.25rem",
    height: "1.25rem",
    color: "#9ca3af",
  },
  passwordToggle: {
    position: "absolute",
    right: "1rem",
    top: "0.875rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    transition: "color 0.2s ease-in-out",
    fontSize: "1rem",
  },
  passwordHint: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.5rem",
    marginLeft: "0.25rem",
  },
  primaryButton: {
    width: "100%",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    padding: "0.875rem 1rem",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    transform: "scale(1)",
  },
  primaryButtonHover: {
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    transform: "scale(1.02)",
    boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
  },
  primaryButtonActive: {
    transform: "scale(0.98)",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "scale(1)",
  },
  loginSection: {
    textAlign: "center",
    paddingTop: "1rem",
    borderTop: "1px solid #f3f4f6",
    marginTop: "1.5rem",
  },
  loginText: {
    color: "#6b7280",
    margin: 0,
  },
  loginLink: {
    color: "#10b981",
    fontWeight: "600",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.2s ease-in-out",
  },
  loginLinkHover: {
    color: "#059669",
    textDecoration: "underline",
  },
  footer: {
    textAlign: "center",
  },
  footerText: {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: 0,
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  spinner: {
    width: "1.25rem",
    height: "1.25rem",
    animation: "spin 1s linear infinite",
  },
  securityFeatures: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "0.75rem",
    padding: "1rem",
    marginBottom: "1.5rem",
  },
  securityTitle: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#166534",
    margin: "0 0 0.5rem 0",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  securityList: {
    fontSize: "0.75rem",
    color: "#15803d",
    margin: 0,
    paddingLeft: "1rem",
  },
};

const keyframes = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default function Register({
  onRegisterSuccess = () => {},
  switchToLogin = () => {},
}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (username.trim().length === 0) {
      setError("Username cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      // Check if username already exists
      const usernameDoc = await getDoc(doc(db, "usernames", username));
      if (usernameDoc.exists()) {
        setError("Username already taken, please choose another.");
        setIsLoading(false);
        return;
      }

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save username mapping for uniqueness check
      await setDoc(doc(db, "usernames", username), {
        uid: userCredential.user.uid,
        email,
        createdAt: new Date().toISOString(),
      });

      // Save user profile (if you want a users collection)
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      onRegisterSuccess(userCredential.user);
    } catch (firebaseError) {
      setError(firebaseError.message || "Registration failed.");
    }
    setIsLoading(false);
  };

  return (
    <>
      <style>{keyframes}</style>
      <main style={styles.container}>
        <section style={styles.cardWrapper}>
          <article style={styles.card}>
            <header style={styles.header}>
              <div style={styles.iconContainer} aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  aria-hidden="true"
                  style={{ width: "2rem", height: "2rem" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0-2.21 3-4 3-4s-3-1.79-3-4c0 2.21-3 4-3 4s3 1.79 3 4z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11v10"
                  />
                </svg>
              </div>
              <h1 style={styles.title}>Create your account</h1>
              <p style={styles.subtitle}>Sign up to start your journey</p>
            </header>

            {error && (
              <div role="alert" style={styles.errorContainer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="#b91c1c"
                  aria-hidden="true"
                  style={{ width: "1.5rem", height: "1.5rem" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M12 3v2m0 14v2m7-7h2M3 12h2m14.364-4.364l1.414 1.414M4.222 19.778l1.414-1.414M19.778 19.778l-1.414-1.414M4.222 4.222l1.414 1.414"
                  />
                </svg>
                <p style={{ margin: 0, color: "#b91c1c" }}>{error}</p>
              </div>
            )}

            <form
              onSubmit={handleRegister}
              style={styles.formContainer}
              noValidate
              aria-describedby="register-form-errors"
            >
              {/* Email */}
              <div style={styles.fieldContainer}>
                <label htmlFor="email" style={styles.label}>
                  Email address
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "register-form-errors" : undefined}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "email" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <svg
                    style={styles.inputIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="#9ca3af"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Username */}
              <div style={styles.fieldContainer}>
                <label htmlFor="username" style={styles.label}>
                  Username
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    aria-required="true"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "register-form-errors" : undefined}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "username" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("username")}
                    onBlur={() => setFocusedInput(null)}
                    minLength={3}
                    maxLength={20}
                  />
                  <svg
                    style={styles.inputIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="#9ca3af"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.121 17.804A4 4 0 117.5 15.5m4.5-4.5a4 4 0 11-6 6"
                    />
                  </svg>
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldContainer}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-required="true"
                    aria-describedby="password-hint"
                    style={{
                      ...styles.input,
                      paddingRight: "3rem",
                      ...(focusedInput === "password" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={styles.passwordToggle}
                    tabIndex={0}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="#9ca3af"
                        style={{ width: "1.25rem", height: "1.25rem" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.967 9.967 0 015.595 1.85M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="#9ca3af"
                        style={{ width: "1.25rem", height: "1.25rem" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p id="password-hint" style={styles.passwordHint}>
                  Minimum 8 characters.
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.primaryButton,
                  ...(hoveredButton === "submit" ? styles.primaryButtonHover : {}),
                  ...(isLoading ? styles.primaryButtonDisabled : {}),
                }}
                onMouseEnter={() => setHoveredButton("submit")}
                onMouseLeave={() => setHoveredButton(null)}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span style={styles.loadingContainer} aria-live="polite">
                    <svg
                      style={styles.spinner}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="31.415,31.415"
                        strokeDashoffset="0"
                      />
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <section style={styles.loginSection}>
              <p style={styles.loginText}>
                Already have an account?{" "}
                <button
                  onClick={switchToLogin}
                  style={styles.loginLink}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = styles.loginLinkHover.color)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = styles.loginLink.color)
                  }
                  aria-label="Switch to login form"
                >
                  Log in
                </button>
              </p>
            </section>
          </article>

          <footer style={styles.footer}>
            <p style={styles.footerText}>&copy; 2025 Firebase. All rights reserved.</p>
          </footer>
        </section>
      </main>
    </>
  );
}
