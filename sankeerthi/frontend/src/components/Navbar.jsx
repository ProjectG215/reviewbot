import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage the menu visibility
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setIsLoggedIn(false); // Update the logged-in state
        navigate('/'); // Redirect to home or login page
        window.location.reload();
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle the menu state
    };

    return (
        <header className="header">
            <Link to="/" className="logo">ProBot</Link>
            <div className="hamburger" onClick={toggleMenu}>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
                <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
            </div>
            <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
                {/* <Link to="/products">Products</Link> */}
                {isLoggedIn &&
                <Link to="/link">Link Insights</Link>}
                {isLoggedIn && 
                <Link to='/history'>History</Link>}
                {isLoggedIn ? (
                    <Link onClick={handleLogout}>Logout</Link>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>
        </header>
    );
}

export default Navbar;
