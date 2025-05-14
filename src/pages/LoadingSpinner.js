import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="pulse-loader">
        <div className="pulse-dot"></div>
        <div className="pulse-dot"></div>
        <div className="pulse-dot"></div>
      </div>
      <div className="loading-text">HopeTag is getting ready...</div>
    </div>
  );
};

export default LoadingSpinner;
