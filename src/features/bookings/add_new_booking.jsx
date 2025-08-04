import React, { useState } from "react";
const BookingForm = ({ isOpen, inClose, onSave }) => {
  const [formData, setFormData] = useState({
    location: "",
    meetingRoom: "",
    companyName: "",
    member: "",
    date: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    if (onSave) onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="location-form">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1' }}>
            <label>Location</label><br />
            <select name="location" value={formData.location} onChange={handleChange}>
              <option value="">Select Location</option>
            </select>
          </div>

          <div style={{ flex: '1' }}>
            <label>Meeting Room</label><br />
            <select name="meetingRoom" value={formData.meetingRoom} onChange={handleChange}>
              <option value="">Select Room</option>
            </select>
          </div>

          <div style={{ flex: '1' }}>
            <label>Company</label><br />
            <select name="companyName" value={formData.companyName} onChange={handleChange}>
              <option value="">Select Company</option>
            </select>
          </div>

          <div style={{ flex: '1' }}>
            <label>Member</label><br />
            <select name="member" value={formData.member} onChange={handleChange}>
              <option value="">Select Member</option>
            </select>
          </div>

          <div style={{ flex: '1' }}>
            <label>Date</label><br />
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button type="submit" style={{
            padding: '10px 28px',
            backgroundColor: '#2979ff',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            Proceed
          </button>
        </div>
      </form>
    </div>
  );
}
export default BookingForm;