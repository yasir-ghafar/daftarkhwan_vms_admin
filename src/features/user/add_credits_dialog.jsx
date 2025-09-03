import React, { useState } from "react";
import "./add_credits_dialog.css";

const AddCreditDialog = ({ open, onClose, onSave, onHistory, user }) => {
  const [creditType, setCreditType] = useState("M Room");
  const [credits, setCredits] = useState("");

  if (!open) return null; // only render when open

  const handleSubmit = () => {
    const payload = {
        meeting_room_credits: creditType === "M Room" ? Number(credits) : 0.0,
        printing_credits: creditType === "Printer" ? Number(credits) : 0.0,
    }

    console.log("Submitted:", payload);
    onSave(payload);
  };

  const onHistoryClick = () => {
    if (user.Wallet) {
      onHistory(user.Wallet.id);
    } else {
      alert('No Wallet Found for This User!')
    }
    
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="dialog-header">
          <h2>Add Credits?</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="dialog-content">
          {/* Company Info */}
          <label>Company name</label>
          <input type="text" value={user.Company.name} readOnly />

          <label>User Name</label>
          <input type="text" value={user.name} readOnly />

          {/* Credit Type */}
          <p className="section-label">Credits Type</p>
          <div className="toggle-group">
            <button
              className={creditType === "M Room" ? "active" : ""}
              onClick={() => setCreditType("M Room")}
            >
              💰 M Room
            </button>
            <button
              className={creditType === "Printer" ? "active" : ""}
              onClick={() => setCreditType("Printer")}
            >
              🖨️ Printer
            </button>
          </div>

          {/* Credits Input */}
          <label>Credits</label>
          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          />
        </div>

        <div className="dialog-actions">
          <button className="cancel-btn" onClick={onHistoryClick}>
            View Transaction History
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="add-btn"
            onClick={handleSubmit}
            disabled={!credits}
          >
            Add Credits
          </button>
        </div>
      </div>
    </div>
  );
};



export default AddCreditDialog;