import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() 
{
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Text Section */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl p-10">
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Welcome to ReviewBot
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Your personal assistant for analyzing product reviews. Summarize, understand sentiments, and get valuable insights before making any purchase decisions.
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none">
            Get Started
          </button>
        </div>

        {/* Image Section */}
        <div 
        className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
          <img
            src="https://media.istockphoto.com/id/1290230148/vector/robot-character-information-vector-background-design-robotic-3d-character-help-desk.jpg?s=612x612&w=0&k=20&c=UqwdYBiEf8-fd8ytQh_EX3u6l9y42EU_DmcGJ1f8sfE="
            alt="ReviewBot"
            className="w-64 h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
