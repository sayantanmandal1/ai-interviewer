import React, { useState } from "react";
import { auth, db, googleProvider } from "./firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
    background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)',
    borderRadius: '50%',
    margin: '0 auto 1rem auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
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
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#e5e7eb', 
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box'
  },
  inputFocus: {
    borderColor: '#6366f1',       // keep this as is
    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
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
  primaryButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)',
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
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    transform: 'scale(1.02)',
    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
  },
  primaryButtonActive: {
    transform: 'scale(0.98)'
  },
  primaryButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'scale(1)'
  },
  divider: {
    position: 'relative',
    margin: '1.5rem 0'
  },
  dividerLine: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center'
  },
  dividerBorder: {
    width: '100%',
    borderTop: '1px solid #e5e7eb'
  },
  dividerText: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    fontSize: '0.875rem'
  },
  dividerSpan: {
    padding: '0 1rem',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#6b7280'
  },
  googleButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1rem',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#374151'
  },
  googleButtonHover: {
    background: '#f9fafb',
    borderColor: '#d1d5db',
    transform: 'scale(1.02)'
  },
  registerSection: {
    textAlign: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #f3f4f6',
    marginTop: '1.5rem'
  },
  registerText: {
    color: '#6b7280',
    margin: 0
  },
  registerLink: {
    color: '#6366f1',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out'
  },
  registerLinkHover: {
    color: '#4f46e5',
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

export default function Login({ onLoginSuccess = () => {}, switchToRegister = () => {} }) {
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleEmailOrUsernameLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      let emailToUse = identifier;

      // If input does NOT look like an email, treat it as a username
      if (!identifier.includes("@")) {
        const docSnap = await getDoc(doc(db, "usernames", identifier));
        if (docSnap.exists()) {
          emailToUse = docSnap.data().email;
        } else {
          throw new Error("Username not found");
        }
      }

      await signInWithEmailAndPassword(auth, emailToUse, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess();
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 style={styles.title}>Welcome Back</h2>
              <p style={styles.subtitle}>Sign in to your account</p>
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

            {/* Form */}
            <form onSubmit={handleEmailOrUsernameLogin} style={styles.formContainer}>
              {/* Email/Username Field */}
              <div style={styles.fieldContainer}>
                <label style={styles.label}>Email or Username</label>
                <div style={styles.inputWrapper}>
                  <input
                    type="text"
                    placeholder="Enter your email or username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    style={{
                      ...styles.input,
                      paddingRight: '1rem',
                      ...(focusedInput === 'identifier' ? styles.inputFocus : {})
                    }}
                    onFocus={() => setFocusedInput('identifier')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Password Field */}
              <div style={styles.fieldContainer}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.primaryButton,
                  ...(hoveredButton === 'login' && !isLoading ? styles.primaryButtonHover : {}),
                  ...(isLoading ? styles.primaryButtonDisabled : {})
                }}
                onMouseEnter={() => !isLoading && setHoveredButton('login')}
                onMouseLeave={() => setHoveredButton(null)}
                onMouseDown={() => !isLoading && setHoveredButton('loginActive')}
                onMouseUp={() => !isLoading && setHoveredButton('login')}
              >
                {isLoading ? (
                  <div style={styles.loadingContainer}>
                    <svg style={styles.spinner} viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine}>
                <div style={styles.dividerBorder}></div>
              </div>
              <div style={styles.dividerText}>
                <span style={styles.dividerSpan}>or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{
                ...styles.googleButton,
                ...(hoveredButton === 'google' && !isLoading ? styles.googleButtonHover : {}),
                ...(isLoading ? { opacity: 0.6, cursor: 'not-allowed' } : {})
              }}
              onMouseEnter={() => !isLoading && setHoveredButton('google')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Register Link */}
            <div style={styles.registerSection}>
              <p style={styles.registerText}>
                Don't have an account?{" "}
                <button
                  onClick={switchToRegister}
                  style={{
                    ...styles.registerLink,
                    ...(hoveredButton === 'register' ? styles.registerLinkHover : {})
                  }}
                  onMouseEnter={() => setHoveredButton('register')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Create one now
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Secure login powered by Firebase
            </p>
          </div>
        </div>
      </div>
    </>
  );
}