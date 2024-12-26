import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleAnalyzeReviewsClick = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      navigate('/link-input');
    } else {
      navigate('/login', { state: { message: 'Please login to analyze reviews through a link.' } });
    }
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="content">
          <h1>Welcome to ProBot - Your smart shopping companion! </h1>
          <p>
            We turn endless reviews into clear insights by scraping product reviews, analyzing sentiment, and delivering concise summaries.
          </p>
          <p>
            <span className="got-questions">Got questions?</span> Our chatbot is here with tailored answers, helping you shop smarter and faster. With ProBot, every product's story is just a click away. Let's make shopping fun and effortless!
          </p>
          <div className="buttons">
            <button onClick={handleAnalyzeReviewsClick} className="home-btn">
              Analyze Reviews
            </button>
          </div>
        </div>
        <img src="./botpng.png" alt="Review Bot" className="robot-image" />
      </div>
    </div>
  );
};

export default Home;
