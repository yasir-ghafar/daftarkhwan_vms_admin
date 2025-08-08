import React from "react";


const ErrorPopup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-popup-overlay">
      <div className="error-popup">
        <button className="error-popup-close" onClick={onClose}>&times;</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorPopup;