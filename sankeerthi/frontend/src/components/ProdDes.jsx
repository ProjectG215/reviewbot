import React, { useState, useEffect, useRef } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { IoMdSend } from "react-icons/io";
import { FaRobot, FaUser } from "react-icons/fa"; // Import icons for bot and user
import axios from 'axios';
import Loader from './Loader';
import './ProdDes.css';

const ProdDes = ({ details }) => {
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState(() => {
    const storedDetails = sessionStorage.getItem('productDetails');
    return details || (storedDetails ? JSON.parse(storedDetails) : null);
  });
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (details) {
      sessionStorage.setItem('productDetails', JSON.stringify(details));
    }
  }, [details]);

  useEffect(() => {
    console.log("Details in Description :", productDetails);
  }, [productDetails]);

  const { image, name, price, sumRes, pos, neg, high } = productDetails || {};

  const chartData = {
    series: [
      { data: [{ id: 0, value: pos, label: 'Positive' }, { id: 1, value: neg, label: 'Negative' }] }
    ]
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!question.trim()) return;

    const newMessage = { sender: 'user', text: question };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    // Call /storeMessage to store user message
    try {
      await axios.post("http://localhost:3001/storeMessage", {
        productId: productDetails?._id, 
        sender: 'user', 
        text: question 
      });
    } catch (error) {
      console.error('Error storing user message:', error);
    }

    setQuestion('');
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/chatBot", { question });
      const botReply = { sender: 'bot', text: response.data?.answer || 'Sorry, I did not understand that.' };
      setChatMessages((prevMessages) => [...prevMessages, botReply]);

      // Call /storeMessage to store bot reply
      try {
        await axios.post("http://localhost:3001/storeMessage", {
          productId: productDetails?._id, 
          sender: 'bot', 
          text: botReply.text 
        });
      } catch (error) {
        console.error('Error storing bot reply:', error);
      }

    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Error: Unable to process your message at the moment.' };
      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="prod-container">
      <div className="prod-wrapper">
        <div className="prod-card">
          <div className="prod-main">
            <div className="prod-image-container">
              <img src={image} alt={name} className="prod-image" />
            </div>
            <div className="prod-info">
              <h1 className="prod-title">{name}</h1>
              <div className="prod-price">{price}</div>
              <div className="prod-highlights">
                {high && high.map((text, index) => (
                  <div key={index} className="prod-highlight-text">{text}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="prod-summary-section">
            {sumRes && pos && neg && (
              <div className="prod-summary-wrapper">
                <div className="prod-summary">
                  <h2>Product Summary</h2>
                  <p>{sumRes}</p>
                </div>
                <div className="prod-sentiment-container">
                  <h2 className="prod-sentiment-title">Customer Sentiment</h2>
                  <PieChart series={chartData.series} width={400} height={200} />
                </div>
              </div>
            )}
          </div>
          <div className="prod-chatbot-section">
            <h2 className="prod-chatbot-title">Product Assistant</h2>
            <div className="prod-chatbot-wrapper">
              <div className="prod-chatbot-messages" ref={chatContainerRef}>
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                    {msg.sender === 'bot' && (
                      <>
                        <div className="message-icon">
                          <FaRobot size={24} />
                        </div>
                        <span className="message">{msg.text}</span>
                      </>
                    )}

                    {msg.sender === 'user' && (
                      <>
                        <span className="message">{msg.text}</span>
                        <div className="message-icon">
                          <FaUser size={24} />
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <span>.</span><span>.</span><span>.</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="prod-chatbot-input">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>
                  <IoMdSend size={30} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProdDes;
