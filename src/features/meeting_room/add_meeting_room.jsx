import "./add_meeting_room.css";
import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";

//const locations = ["New York", "London", "Berlin", "Tokyo"];
const floors = ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AddRoomModal = ({ isOpen, onClose, onSave, locations, selectedRoom, editData, amenities }) => {
  const [imagePreview, setImagePreview] = useState(null);

  console.log(amenities);
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    name: "",
    locationId:  "",
    creditsPerSlot: "",
    pricePerCredit: "",
    seatingCapacity: "",
    image: "",
    openingTime:  "",
    closingTime: "",
    floor:  "",
    status:  "active",
    availableDays: [],
    amenities: [],
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        locationId: editData.locationId || "",
        creditsPerSlot: editData.creditsPerSlot?.toString() || "",
        pricePerCredit: editData.pricePerCredit?.toString() || "",
        seatingCapacity: editData.seatingCapacity?.toString() || "",
        image: "",
        openingTime: editData.openingTime || "",
        closingTime: editData.closingTime || "",
        floor: editData.floor || "",
        status: editData.status || "active",
        availableDays: Array.isArray(editData.availableDays) ? editData.availableDays : [],
        amenities: Array.isArray(editData.amenities) ? editData.amenities : [],
      });
      setImagePreview(editData.imageUrl || null);
    } 
  }, [editData]);



  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    } else {
      // If editing and no new file selected, show existing image if present
      if (!imagePreview && selectedRoom?.imageUrl) {
        setImagePreview(selectedRoom.imageUrl);
      }
    }
  };

  const removeImage = () => {
  setForm((prev) => ({ ...prev, image: null }));
  setImagePreview(null);

  
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingObject = {
      customerId: form.customerId,
      companyId: form.companyId,
      roomId: form.meetingRoom,
      locationId: form.location,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
    };

    console.log("🧠 BookingForm log:", bookingObject); // 👈 This hits immediately

    if (onSave) onSave(bookingObject);
  };
  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="location-form">
        <h3 style={{ marginBottom: '12px', color: '#2c3e50', width: "100%" }}>
          {editData ? "Edit Meeting Room" : "Create Meeting Room"}
        </h3>
        <h3 className="form-header">Create Meeting Room</h3>

        {/* Room Info */}
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
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                {floors.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Slot & Pricing Info */}
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

        {/* Image, Floor, Status */}
        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Status:</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Amenities:</label>
              <Select
                options={amenities.map((amenity) => ({
                  value: amenity.id,
                  label: amenity.name,
                }))}
                isMulti
                name="amenities"
                className="basic-multi-select"
                classNamePrefix="select"
                value={amenities
                  .filter((amenity) => form.amenities.includes(amenity))
                  .map((amenity) => ({ value: amenity.id, label: amenity.value }))}
                onChange={(selectedOptions) =>
                  setForm((prev) => ({
                    ...prev,
                    amenities: selectedOptions.map((amenity) => amenity.value),
                  }))
                }
              />
            </div>
          </div>
          <div className="form-column">
            <div className="form-group">
              <label>Upload Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </div>
          </div>
          <div className="form-column">
            <div className="form-group">
              {imagePreview && (
                <div className="image-preview-wrapper">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removeImage}
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Days */}
        <div className="form-row">
          <div className="form-column full-width">
            <div className="form-group available-days">
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
          </div>
        </div>

        {/* Actions */}
        <div className="form-row">
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoomModal;
