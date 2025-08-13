import React from "react";

const Loadder = ({ message }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-dialog">
        <div className="loader"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loadder;
