import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="spinner-large"></div>
      <p className="spinner-text">Fetching post from Reddit...</p>
    </div>
  );
};

export default LoadingSpinner;