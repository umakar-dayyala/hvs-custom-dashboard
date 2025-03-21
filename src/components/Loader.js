import React from "react";
import "../css/Loader.css"; // Import the CSS file

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-dots">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="dot"
            style={{
              transform: `rotate(${i * 30}deg) translate(60px)`,
              animationDelay: `${i * 0.1}s`,
            }}
          ></span>
        ))}
      </div>
      {/* Loading Text with Moving Dots */}
      <div className="loader-text">
        <span className="loader-loading">Loading</span>
        <span className="loader-dot">.</span>
        <span className="loader-dot" style={{ animationDelay: "0.3s" }}>.</span>
        <span className="loader-dot" style={{ animationDelay: "0.6s" }}>.</span>
      </div>
    </div>
  );
};

export default Loader;
