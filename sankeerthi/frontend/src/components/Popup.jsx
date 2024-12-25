import React from 'react';
import './Popup.css'; // Add CSS styles for your popup

const Popup = ({ message, type }) => {
  return (
    <div className={`popup ${type}`}>
      {message}
    </div>
  );
}

export default Popup;
