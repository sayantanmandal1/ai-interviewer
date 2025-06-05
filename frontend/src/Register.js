import React, { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f0fdff 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  cardWrapper: {
    width: '100%',
    maxWidth: '28rem'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '2rem',
    marginBottom: '1.5rem'
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  iconContainer: {
    width: '4rem',
    height: '4rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '50%',
    margin: '0 auto 1rem auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem',
    margin: 0
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1rem',
    margin: 0
  },
  errorContainer: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.75rem',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    animation: 'pulse 2s infinite'
  },
  formContainer: {
    marginBottom: '1.5rem'
  },
  fieldContainer: {
    marginBottom: '1.25rem'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  inputWrapper: {
    position: 'relative'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    paddingLeft: '3rem',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box'
  },
  inputFocus: {
    borderColor: '#10b981',
    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    top: '0.875rem',
    width: '1.25rem',
    height: '1.25rem',
    color: '#9ca3af'
  },
  passwordToggle: {
    position: 'absolute',
    right: '1rem',
    top: '0.875rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    transition: 'color 0.2s ease-in-out'
  },
  passwordHint: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.5rem',
    marginLeft: '0.25rem'
  },
  primaryButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    padding: '0.875rem 1rem',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    transform: 'scale(1)'
  },
  primaryButtonHover: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    transform: 'scale(1.02)',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
  },
  primaryButtonActive: {
    transform: 'scale(0.98)'
  },
  primaryButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'scale(1)'
  },
  loginSection: {
    textAlign: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #f3f4f6',
    marginTop: '1.5rem'
  },
  loginText: {
    color: '#6b7280',
    margin: 0
  },
  loginLink: {
    color: '#10b981',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out'
  },
  loginLinkHover: {
    color: '#059669',
    textDecoration: 'underline'
  },
  footer: {
    textAlign: 'center'
  },
  footerText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  spinner: {
    width: '1.25rem',
    height: '1.25rem',
    animation: 'spin 1s linear infinite'
  },
  securityFeatures: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginBottom: '1.5rem'
  },
  securityTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#166534',
    margin: '0 0 0.5rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  securityList: {
    fontSize: '0.75rem',
    color: '#15803d',
    margin: 0,
    paddingLeft: '1rem'
  }
};

// Add keyframes for animations
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

export default function Register({ onRegisterSuccess = () => {}, switchToLogin = () => {} }) {
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
    setIsLoading(true);
    setError(null);
    try {
      // 1. Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Save username-to-email mapping in Firestore
      await setDoc(doc(db, "usernames", username), {
        email,
        uid: userCredential.user.uid
      });

      onRegisterSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={styles.cardWrapper}>
          <div style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.iconContainer}>
                <svg style={{ width: '2rem', height: '2rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 style={styles.title}>Create Account</h2>
              <p style={styles.subtitle}>Join us and get started today</p>
            </div>

            {/* Error Message */}
            {error && (
              <div style={styles.errorContainer}>
                <svg style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p style={{ color: '#b91c1c', fontSize: '0.875rem', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Security Features */}
            <div style={styles.securityFeatures}>
              <p style={styles.securityTitle}>
                <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure Account Creation
              </p>
              <ul style={styles.securityList}>
                <li>Username must be unique</li>
                <li>Password must be at least 6 characters long</li>
                <li>Your data is encrypted and secure</li>
                <li>Email verification available after signup</li>
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} style={styles.formContainer}>
              {/* Username Field */}
              <div style={styles.fieldContainer}>
                <label style={styles.label}>Username</label>
                <div style={styles.inputWrapper}>
                  <input
                    type="text"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{
                      ...styles.input,
                      paddingRight: '1rem',
                      ...(focusedInput === 'username' ? styles.inputFocus : {})
                    }}
                    onFocus={() => setFocusedInput('username')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Email Field */}
              <div style={styles.fieldContainer}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      ...styles.input,
                      paddingRight: '1rem',
                      ...(focusedInput === 'email' ? styles.inputFocus : {})
                    }}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>

              {/* Password Field */}
              <div style={styles.fieldContainer}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (6+ characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{
                      ...styles.input,
                      paddingRight: '3rem',
                      ...(focusedInput === 'password' ? styles.inputFocus : {})
                    }}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      ...styles.passwordToggle,
                      color: hoveredButton === 'toggle' ? '#4b5563' : '#9ca3af'
                    }}
                    onMouseEnter={() => setHoveredButton('toggle')}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    {showPassword ? (
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p style={styles.passwordHint}>Password must be at least 6 characters long</p>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.primaryButton,
                  ...(hoveredButton === 'register' && !isLoading ? styles.primaryButtonHover : {}),
                  ...(isLoading ? styles.primaryButtonDisabled : {})
                }}
                onMouseEnter={() => !isLoading && setHoveredButton('register')}
                onMouseLeave={() => setHoveredButton(null)}
                onMouseDown={() => !isLoading && setHoveredButton('registerActive')}
                onMouseUp={() => !isLoading && setHoveredButton('register')}
              >
                {isLoading ? (
                  <div style={styles.loadingContainer}>
                    <svg style={styles.spinner} viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div style={styles.loginSection}>
              <p style={styles.loginText}>
                Already have an account?{" "}
                <button
                  onClick={switchToLogin}
                  style={{
                    ...styles.loginLink,
                    ...(hoveredButton === 'login' ? styles.loginLinkHover : {})
                  }}
                  onMouseEnter={() => setHoveredButton('login')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Secure registration powered by Firebase
            </p>
          </div>
        </div>
      </div>
    </>
  );
}