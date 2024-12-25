import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaTools, FaRobot, FaSmile, FaCommentDots } from 'react-icons/fa';
import io from 'socket.io-client';
import './PopupStages.css';

const stages = [
  { id: 1, name: 'Link Validation', icon: <FaFileAlt /> },
  { id: 2, name: 'Scrapping Data', icon: <FaTools /> },
  { id: 3, name: 'Loading Knowledge Base', icon: <FaRobot /> },
  { id: 4, name: 'Sentiment Analysis', icon: <FaSmile /> },
  { id: 5, name: 'Summarizing Reviews', icon: <FaCommentDots /> },
];

const PopupStages = () => {
  const [currentStage, setCurrentStage] = useState(0);
  
  useEffect(() => {
    const socket = io("http://localhost:5000"); // Adjust the URL to your server

    // Listen for progress updates from the server
    socket.on("progress", (data) => {
      setCurrentStage(data.stage);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Processing...</h2>
        <div className="stages-container">
          {stages.map((stage) => (
            <div key={stage.id} className="stage-wrapper">
              <div
                className={`stage ${
                  currentStage === stage.id ? 'active' : currentStage > stage.id ? 'completed' : ''
                }`}
              >
                <div className="stage-icon">{stage.icon}</div>
                <div className="stage-name">{stage.name}</div>
              </div>
              {stage.id < stages.length && (
                <div
                  className={`stage-line ${
                    currentStage > stage.id ? 'completed' : ''
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopupStages;
