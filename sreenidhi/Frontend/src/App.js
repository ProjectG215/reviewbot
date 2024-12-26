import './App.css';
import React from'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import AboutUs from './components/AboutUs';
import Link from './components/Link';
import ProductDescription from './components/ProductDescription';
import ProfilePage from './components/ProfilePage';
import ChatBotPage from './components/ChatBotPage';

function App() {
  return (
    <div className="min-h-screen bg-[#bcd4d3"> {/* Apply background globally */}
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element = {<Login/>}/>
        <Route path = "/register" element={<Register/>}/>
        <Route path="/aboutUs" element={<AboutUs />}/>
        <Route path = '/link' element={<Link/>}/>
        <Route path = '/productDescription' element= {<ProductDescription/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path = '/chatbot' element = {<ChatBotPage/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
