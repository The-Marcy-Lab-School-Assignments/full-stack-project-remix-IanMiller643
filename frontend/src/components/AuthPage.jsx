import { useState } from 'react';
import './AuthPage.css'; // <--- Import the styles here

// --- Sub-Component: Login Form ---
function LoginForm({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    const error = await handleLogin(username, password);
    if (error) setErrorMessage('Invalid username or password.');
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Log In</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      <button type="submit" className="auth-btn">Log In</button>
    </form>
  );
}

// --- Sub-Component: Register Form ---
function RegisterForm({ handleRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    const error = await handleRegister(username, password);
    if (error) setErrorMessage('Could not register. Username may be taken.');
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create Account</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      <button type="submit" className="auth-btn register">Register</button>
    </form>
  );
}

// --- Main AuthPage Component ---
function AuthPage({ handleLogin, handleRegister }) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {isLoginMode ? (
          <LoginForm handleLogin={handleLogin} />
        ) : (
          <RegisterForm handleRegister={handleRegister} />
        )}

        <div className="auth-toggle">
          <p>
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="toggle-link"
            >
              {isLoginMode ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;