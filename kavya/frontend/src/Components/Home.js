import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home=()=> {

  const { isLoggedIn } = useAuth();
    return (
        <div className="min-h-screen bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Transform Your Reviews with AI
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get instant, intelligent feedback on your products and services
              </p>

              {!isLoggedIn ?
              
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              :<></>
              }
              

            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80"
                  alt="AI Analysis"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Smart Analysis
                  </h3>
                  <p className="text-gray-600">
                    Advanced AI algorithms analyze your reviews for meaningful insights
                  </p>
                </div>
              </div>
    
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80"
                  alt="Real-time Processing"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Real-time Results
                  </h3>
                  <p className="text-gray-600">
                    Get instant feedback and actionable insights from your reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default Home;