import './add_meeting_room.css';
import React, { useState } from "react";
import Select from 'react-select';

const amenitiesOptions = [
  "Projector", "Whiteboard", "Video Conferencing", "AC", "WiFi", "Blackboard","Markers","Tea"
];

//const locations = ["New York", "London", "Berlin", "Tokyo"];
const floors = ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AddRoomModal = ({ isOpen, onClose, onSave, locations }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    locationId: "",
    creditsPerSlot: "",
    pricePerCredit: "",
    seatingCapacity: "",
    image: "",
    openingTime: "",
    closingTime: "",
    floor: "",
    availableDays: [],
    amenities: [],
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  const handleDayToggle = (day) => {
    setForm(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating Meeting Room:", form);
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="location-form">
        <h3 style={{ marginBottom: '12px', color: '#2c3e50', width: "100%" }}>Create Meeting Room</h3>

        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Room Name:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label>Location:</label>
              <select
                name="locationId"
                value={form.locationId}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Credits/Slot:</label>
              <input
                type="number"
                name="creditsPerSlot"
                value={form.creditsPerSlot}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label>Price per 1 Credit:</label>
              <input
                type="number"
                name="pricePerCredit"
                value={form.pricePerCredit}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label>Seating Capacity:</label>
              <input
                type="number"
                name="seatingCapacity"
                value={form.seatingCapacity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Upload Image:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px", marginTop: "8px" }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Opening Time:</label>
              <input
                type="time"
                name="openingTime"
                value={form.openingTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label>Closing Time:</label>
              <input
                type="time"
                name="closingTime"
                value={form.closingTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Amenities:</label>
              <Select
                options={amenitiesOptions.map(option => ({ value: option, label: option }))}
                isMulti
                name="amenities"
                className="basic-multi-select"
                classNamePrefix="select"
                value={amenitiesOptions
                  .filter(option => form.amenities.includes(option))
                  .map(option => ({ value: option, label: option }))}
                onChange={(selectedOptions) =>
                  setForm(prev => ({
                    ...prev,
                    amenities: selectedOptions.map(option => option.value)
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Floor:</label>
              <select
                name="floor"
                value={form.floor}
                onChange={handleChange}
                required
              >
                <option value="">Select Floor</option>
                {floors.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-column">
            <div className="form-group available-days">
              <label>Available Days:</label>
              <div className="day-boxes">
                {weekdays.map(day => (
                  <div
                    key={day}
                    className={`day-box ${form.availableDays.includes(day) ? 'selected' : ''}`}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoomModal;