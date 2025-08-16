import React from "react";

const SuccessPopup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="success-popup-overlay">
      <div className="success-popup">
        <button className="success-popup-close" onClick={onClose}>
          &times;
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessPopup;