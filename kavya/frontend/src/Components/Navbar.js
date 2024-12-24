import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] backdrop-blur-sm bg-white/90 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
      
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-semibold text-gray-800">ReviewBot</span>
            </Link>
          </div>

         
          <button
            className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
            onClick={toggleMenu}
          >
            {menuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>

      
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/history" className="text-gray-600 hover:text-blue-600">History</Link>
                <Link to="/link" className="text-gray-600 hover:text-blue-600">Add Link</Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            )}
          </div>
        </div>

      
        {menuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col space-y-2 mt-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/history"
                    className="text-gray-600 hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    History
                  </Link>
                  <Link
                    to="/link"
                    className="text-gray-600 hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Add Link
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 mb-3"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
