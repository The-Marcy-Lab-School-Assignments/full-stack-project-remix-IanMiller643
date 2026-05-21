import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Adapters
import { getMe, login, register, logout } from './adapters/auth-adapters';

// Components 
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import StudyView from './components/StudyView';
import LandingPage from './components/LandingPage';
import DeckEditor from './components/DeckEditor';


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Sync User Session on Mount
  useEffect(() => {
    const checkForSession = async () => {
      const { data: user } = await getMe();
      if (user) setCurrentUser(user);
      setLoading(false);
    };
    checkForSession();
  }, []);

  // 2. Auth Handlers
  const handleLogin = async (username, password) => {
    const { data: user, error } = await login(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleRegister = async (username, password) => {
    const { data: user, error } = await register(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  // Prevent "flicker" where the app shows the login page before checking the session
  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <Router>
      <Navbar user={currentUser} setUser={setCurrentUser} />

      <main className="container">
        <Routes>
          {/* Public Route: Anyone can see the landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Route: Only show if NOT logged in; otherwise redirect to dashboard */}
          <Route
            path="/auth"
            element={
              currentUser
                ? <Navigate to="/dashboard" />
                : <AuthPage handleLogin={handleLogin} handleRegister={handleRegister} />
            }
          />

          {/* Protected Route: Only logged-in users can see their dashboard */}
          <Route
            path="/dashboard"
            element={
              currentUser
                ? <Dashboard currentUser={currentUser} />
                : <Navigate to="/auth" />
            }
          />

          {/* Route for the DeckEditor to create or delete a card. */}
          <Route
            path="/edit/:deck_id"
            element={
              currentUser
                ? <DeckEditor />
                : <Navigate to="/auth" />
            }
          />

          {/* Study Route: Pass the deck_id from the URL to the component */}
          <Route
            path="/study/:deck_id"
            element={
              currentUser
                ? <StudyView />
                : <Navigate to="/auth" />
            }
          />

          {/* 404 Catch-all */}
          <Route path="*" element={<h2>404: Page Not Found</h2>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;