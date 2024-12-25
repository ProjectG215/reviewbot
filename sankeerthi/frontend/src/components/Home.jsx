import React, { useRef } from "react";
import "./Home.css"; // Ensure correct path for your CSS file
import { useNavigate } from "react-router-dom";

const Home = ({isLoggedIn}) => {
  const navigate = useNavigate();
  const secondHomeRef = useRef(null);

  const handleClick = () => {
    secondHomeRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleDirect = () =>{
    if(isLoggedIn){
      navigate('/link');
    }
    else{
      alert("Please login!")
      navigate('/login')
    }

  }

  return (
    <div>
      <div className="home-container">
        <div className="image-section"></div> 
        <div className="text-section">
          <h1><span style={{color:"#facc15"}}>Explore</span> ProBot</h1>
          <p>Your Virtual Product Assistant</p>
          <button className="discover-btn" onClick={handleClick}>Discover More</button>
        </div>
      </div>
      
      {/* New Section with Waves */}
      <div className="second-home" ref={secondHomeRef}>
          <div className="text-section">
            <h1>Curiosity meets clarity - Discover your product.</h1>
          </div>
          <div className="btn-section">
          <p>Try out the chatbot feature today!</p>
            <button className="discover-btn" onClick={handleDirect}>Try Now</button>
          </div>
        </div>
      </div>
  );
};

export default Home;
