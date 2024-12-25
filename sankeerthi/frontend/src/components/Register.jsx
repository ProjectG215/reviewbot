import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from 'axios';
import Success from './Success'
import Error from './Error'

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError,setShowError] = useState(false);
  const [showSucc,setShowSucc] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/register', { name, email, password })
      .then(result => {
        console.log(result);

        if (result.data.message === "User registered successfully") {
          setShowSucc(true);
          setTimeout(() => {
            setShowSucc(false);
            navigate('/login');
          }, 3500);
        } else {
          setShowError(true)
          setTimeout(() => {
            setShowError(false);
          }, 3500);
        }
      })
      .catch(err => {
        console.error(err.response.data); 
        setShowError(true)
        setTimeout(() => {
          setShowError(false);
        }, 3500);
      });
};

  

  return (
    <>
      {showSucc && <Success/>}
      {showError && <Error/>}
      <div className='container'>
          <form className='content' onSubmit={handleSubmit}>
          <div className='head'><span style={{color:"#facc15"}}>Register</span> Form</div>
          <h1>Create Account</h1>
            <input
              type="text"
              className="input"
              autoComplete="off"
              placeholder='Username'
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              className="input"
              autoComplete="off"
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="input"
              autoComplete="off"
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="button">Register</button>
            <p className="text">
            Already have an account? <Link to="/login">LogIn</Link>
        </p>
        <br/>
          </form>
        </div>
    </>
  );
}
