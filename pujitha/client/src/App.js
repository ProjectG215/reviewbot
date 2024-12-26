import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import LinkInput from './components/LinkInput';
import NotFound from './components/NotFound';
import ProductDetail from './components/ProductDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [details, setDetails] = useState({});

  useEffect(() => {
    // Initialize authentication state from localStorage
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const storedUsername = localStorage.getItem('username') || '';
    setIsAuthenticated(authStatus);
    setUsername(storedUsername);
  }, []);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
    localStorage.setItem('isAuthenticated', true);
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/link-input"
          element={
            isAuthenticated ? (
              <LinkInput props={setDetails} />
            ) : (
              <Navigate to="/login" state={{ message: 'Please login to analyze reviews through a link.' }} />
            )
          }
        />
        <Route
          path="/product"
          element={
            isAuthenticated ? (
              <ProductDetail />
            ) : (
              <Navigate to="/login" state={{ message: 'Please login to view product details.' }} />
            )
          }
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
