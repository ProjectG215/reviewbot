import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import './bgAnimation.css'; // Ensure this path is correct
import Login from "./components/Login";
import LinkInput from "./components/LinkInput";
import Home from "./components/Home"; // Ensure you import Home
import Register from "./components/Register";
import ProdDes from "./components/ProdDes";
import History from "./components/History";
import './index.css';
import ProductCard from "./components/ProductCard";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [details,setDetails] = useState({});

  return (
    <Router>
      <div>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div>
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn}/>} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route exact path="/register" element={<Register />} />
            <Route path="/link" element={<LinkInput isLoggedIn={isLoggedIn} setDetails={setDetails}/>} />
            <Route path="/history" element={<History setDetails={setDetails}/>}/>
            <Route path="/Description" element={<ProdDes details={details}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
