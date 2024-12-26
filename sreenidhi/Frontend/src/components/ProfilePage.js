import React, { useState, useEffect } from 'react';

function Profile() {
  const [username, setUsername] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); // Retrieve the username from localStorage
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Fetch search history when the component loads
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/search-history', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Optional: Use token-based auth
        }
      });
      const data = await response.json();

      if (response.ok) {
        setSearchHistory(data.history); // Assuming the response contains an array in `history`
      } else {
        console.error('Failed to fetch search history:', data.message);
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome, {username}!</h2>
        <button
          onClick={fetchSearchHistory}
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          View Search History
        </button>

        {searchHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Search History:</h3>
            <ul className="list-disc pl-6 text-gray-700">
              {searchHistory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
