import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [message, setMessage] = useState(''); // For confirmation messages
  const [isSuccess, setIsSuccess] = useState(false); // Flag to style messages based on success or error
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('Form submitted:', formData);

    try {
      // Send form data to the server
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Display success message and set success flag
        setMessage('Registration successful! Redirecting to login...');
        setIsSuccess(true);

        // Redirect to the login page after a delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);

        // Clear the form
        setFormData({
          email: '',
          username: '',
          password: '',
        });
      } else {
        // Display server-provided error message or a generic fallback
        setMessage(data.message || 'Registration failed');
        setIsSuccess(false);
      }
    } catch (error) {
      // Log error and display a generic error message
      console.error('Error during registration:', error);
      setMessage('An error occurred while registering. Please try again later.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Username Input */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Register
            </button>
          </div>
        </form>

        {/* Display Message */}
        {message && (
          <div
            className={`mt-4 text-center font-medium ${
              isSuccess ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </div>
        )}

        {/* Navigation to Sign In */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
