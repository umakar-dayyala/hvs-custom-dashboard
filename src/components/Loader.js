import React from "react";
import '../css/Loader.css'; // Import the updated CSS

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>
      <div className="loader-text">Loading...</div>
      <div className="dots">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>
    </div>
  );
};

export default Loader;
