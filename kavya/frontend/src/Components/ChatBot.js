import React, { useState } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm ReviewBot. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      isBot: false
    };


    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      
      const response = await axios.post('http://localhost:8000/api/chat', { question: input });

      const botMessage = {
        id: messages.length + 2,
        text: response.data.answer || "Sorry, I couldn't process that.",
        isBot: true
      };


      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error communicating with the backend:', error.message);

      const errorMessage = {
        id: messages.length + 2,
        text: "Oops! Something went wrong. Please try again later.",
        isBot: true
      };


      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex">
      {/* <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">History</h3>
        <div className="space-y-2">
          {messages.filter((m) => !m.isBot).map((message) => (
            <div
              key={message.id}
              className="p-2 rounded bg-gray-50 text-gray-700 truncate"
            >
              {message.text}
            </div>
          ))}
        </div>
      </div> */}

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 mb-4 ${
                message.isBot ? '' : 'flex-row-reverse space-x-reverse'
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.isBot
                    ? 'bg-white text-gray-800 border border-gray-200'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
