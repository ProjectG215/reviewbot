import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PopupStages from './PopupStages';
import Loader from './Loader'
import './LinkInput.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LinkInputPage = ({ isLoggedIn, setDetails }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      alert('Please login!');
      setTimeout(() => navigate('/login'), 1000);
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const socket = io('http://localhost:3001'); // Connect to your backend server

    // Listen for progress updates from the server
    socket.on("progress", (data) => {
      setCurrentStage(data.stage);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('Please login first!');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:3001/linkInput',
        { inputValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { productDetails, summary, sentiment, highlights } = response.data;
      setDetails({
        image: productDetails.image,
        name: productDetails.name,
        price: productDetails.price,
        sumRes: summary.summary,
        pos: sentiment.positive,
        neg: sentiment.negative,
        high: highlights,
      });

      navigate('/description');
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pro-container">
      <div className="content">
        <h2>
          <span style={{ color: '#facc15' }}>Product</span> Link
        </h2>
        <input
          type="text"
          className="input"
          placeholder="Enter a link"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="button"
          onClick={handleSubmit}
        >
          Submit
        </button>

        {isLoading && <Loader/>} {/* Stages */}
      </div>
    </div>
  );
};

export default LinkInputPage;
