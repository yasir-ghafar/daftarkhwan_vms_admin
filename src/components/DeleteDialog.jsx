import React from "react";

const DeleteDialog = ({ isOpen, onConfirm, onCancel, message }) => {


  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="dialog-box">
        <h3>Confirm Deletion</h3>
        <p>
          {message}
        </p>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
          <button onClick={onConfirm} className="save-btn">OK</button>
        </div>
      </div>
    </div>
  );
};


export default DeleteDialog;