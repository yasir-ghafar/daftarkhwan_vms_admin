import React, { useState } from "react";
//import './meeting_room.css';

const amenitiesOptions = [
  "Projector",
  "Whiteboard",
  "Video Conferencing",
  "AC",
  "WiFi",
];

const locations = ["New York", "London", "Berlin", "Tokyo"];
const floors = ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AddRoomModal = ({ isOpen, onClose, onSave }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    creditsPerSlot: "",
    pricePerCredit: "",
    seatingCapacity: "",
    image: "",
    openingTime: "",
    closingTime: "",
    floor: "",
    availableDays: [],
    LocationID: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const { options } = e.target;
    const selected = Array.from(options)
      .filter((o) => o.selected)
      .map((o) => o.value);
    setForm((prev) => ({ ...prev, amenities: selected }));
  };

  const handleDayToggle = (day) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ Replace with API call or form processing logic
    console.log("Creating Meeting Room:", form);
    toggleModal();
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className="modal-overlay">
        <h2>Create Meeting Room</h2>
        <form onSubmit={handleSubmit} className="room-form">
          <label>
            Room Name:
            <input
              type="text"
              name="roomName"
              value={form.roomName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Location:
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>

          <label>
            Credits/Slot:
            <input
              type="number"
              name="credits"
              value={form.credits}
              onChange={handleChange}
              min="0"
              required
            />
          </label>

          <label>
            Price per 1 Credit:
            <input
              type="number"
              name="pricePerCredit"
              value={form.pricePerCredit}
              onChange={handleChange}
              min="0"
              required
            />
          </label>

          <label>
            Seating Capacity:
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              min="1"
              required
            />
          </label>

          <label>
            Upload Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          )}

          <label>
            Opening Time:
            <input
              type="time"
              name="openingTime"
              value={form.openingTime}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Closing Time:
            <input
              type="time"
              name="closingTime"
              value={form.closingTime}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Amenities:
            <select
              multiple
              name="amenities"
              value={form.amenities}
              onChange={handleMultiSelectChange}
            >
              {amenitiesOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            Floor:
            <select
              name="floor"
              value={form.floor}
              onChange={handleChange}
              required
            >
              <option value="">Select Floor</option>
              {floors.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>

          <div className="available-days">
            <label>Available Days:</label>
            <div className="day-boxes">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className={`day-box ${
                    form.availableDays.includes(day) ? "selected" : ""
                  }`}
                  onClick={() => handleDayToggle(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

            <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-save">
            Save
          </button>
        </div>
        
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
