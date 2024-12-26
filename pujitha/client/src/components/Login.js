import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const loginMessage = location.state?.message;

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4000/login', { email, password });
      setSuccess(response.data.message);
      setError('');
      onLogin(response.data.username); 
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('isAuthenticated', true);
      navigate('/'); 
    } catch (err) {
      setError('Login failed');
      setSuccess('');
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        {loginMessage && <p className="error-message">{loginMessage}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default Login;
