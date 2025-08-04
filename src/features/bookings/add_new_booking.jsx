import React, { useState, useEffect } from "react";
import { getRooms } from "../../api/rooms_api"; // ✅ updated import

const BookingForm = ({ isOpen, onClose, onSave, locations, editData }) => {
  const [formData, setFormData] = useState({
    location: "",
    meetingRoom: "",
    companyName: "",
    member: "",
    date: ""
  });

  const [meetingRooms, setMeetingRooms] = useState([]);

  useEffect(() => {
    // if editing, pre-fill form data
    if (editData) {
      setFormData({
        location: editData.location || "",
        meetingRoom: editData.meetingRoom || "",
        companyName: editData.companyName || "",
        member: editData.member || "",
        date: editData.date || ""
      });
    }
  }, [editData]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (formData.location) {
        try {
          const res = await getRooms();
          setMeetingRooms(res.data);
        } catch (err) {
          console.error('Failed to fetch meeting rooms:', err);
          setMeetingRooms([]);
        }
      } else {
        setMeetingRooms([]);
      }
    };
    fetchRooms();
  }, [formData.location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="location-form">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1' }}>
            <label>Location</label><br />
            <select name="location" value={formData.location} onChange={handleChange} required>
              <option value="">Select Location</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1' }}>
            <label>Meeting Room</label><br />
            <select name="meetingRoom" value={formData.meetingRoom} onChange={handleChange} required>
              <option value="">Select Room</option>
              {meetingRooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1' }}>
            <label>Company</label><br />
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ flex: '1' }}>
            <label>Member</label><br />
            <input
              type="text"
              name="member"
              value={formData.member}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ flex: '1' }}>
            <label>Date</label><br />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="button-group" style={{ marginTop: '30px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button type="submit" className="btn-proceed">Proceed</button>
          <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
