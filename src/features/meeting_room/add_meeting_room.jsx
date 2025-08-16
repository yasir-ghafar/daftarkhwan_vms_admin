import "./add_meeting_room.css";
import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import SuccessPopup from "../../components/confirmation_popup";

const floors = ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"];
//const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekdays = [{abbrev: "Mon", name: "Monday"}, {abbrev: "Tue", name: "Tuesday"}, {abbrev: "Wed", name: "Wednesday"}, {abbrev: "Thur", name: "Thursday"}, {abbrev: "Fri", name: "Friday"}, {abbrev: "Sat", name: "Saturday"}, {abbrev: "Sun", name: "Sunday"}];

const AddRoomModal = ({ isOpen, onClose, onSave, locations, selectedRoom, amenities }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef();

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
    status: "active",
    availableDays: [],
    amenities: [],
  });

  useEffect(() => {
    if (selectedRoom) {
      setForm({
        name: selectedRoom.name || "",
        locationId: selectedRoom.locationId || "",
        creditsPerSlot: selectedRoom.creditsPerSlot?.toString() || "",
        pricePerCredit: selectedRoom.pricePerCredit?.toString() || "",
        seatingCapacity: selectedRoom.seatingCapacity?.toString() || "",
        image: "",
        openingTime: selectedRoom.openingTime || "",
        closingTime: selectedRoom.closingTime || "",
        floor: selectedRoom.floor || "",
        status: selectedRoom.status || "active",
        availableDays: Array.isArray(selectedRoom.availableDays) ? selectedRoom.availableDays : [],
        amenities: Array.isArray(selectedRoom.amenities) ? selectedRoom.amenities : [],
      });
      setImagePreview(selectedRoom.imageUrl || null);
    } else {
      setForm({
        name: "",
        locationId: "",
        creditsPerSlot: "",
        pricePerCredit: "",
        seatingCapacity: "",
        image: "",
        openingTime: "",
        closingTime: "",
        floor: "",
        status: "active",
        availableDays: [],
        amenities: [],
      });
      setImagePreview(null);
      //setImage(null)
    }
  }, [selectedRoom]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (dayAbbrev) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(dayAbbrev)
        ? prev.availableDays.filter((d) => d !== dayAbbrev)
        : [...prev.availableDays, dayAbbrev],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const formatTimeToAMPM = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12; // Convert 0 to 12 for midnight
    return `${String(h).padStart(2, "0")}:${minute}:00 ${ampm}`;
  };

  const availableDaysFull = form.availableDays.map(
    abbrev => weekdays.find(d => d.abbrev === abbrev)?.name || abbrev
  );

  const amenitiesArray = Array.isArray(form.amenities) ? form.amenities : [form.amenities];

  // Exact object for console log
  const formObject = {
    name: form.name,
    creditsPerSlot: form.creditsPerSlot,
    pricePerCredit: form.pricePerCredit,
    seatingCapacity: form.seatingCapacity,
    image: form.image || selectedRoom?.image,
    openingTime: formatTimeToAMPM(form.openingTime),
    closingTime: formatTimeToAMPM(form.closingTime),
    floor: form.floor,
    availableDays: availableDaysFull,
    locationId: form.locationId,
    status: form.status,
    amenities: amenitiesArray
  };

  console.log(formObject);

  // FormData with exact same format
  const formData = new FormData();
  Object.entries({
    ...formObject,
    availableDays: JSON.stringify(availableDaysFull),
    amenities: JSON.stringify(amenitiesArray)
  }).forEach(([key, value]) => {
    formData.append(key, value);
  });

  if (onSave) onSave(formData);

  setSuccessMessage(selectedRoom ? "Room updated successfully!" : "Room created successfully!");
};

  return (
    <>
      <div className="modal-overlay">
        <form onSubmit={handleSubmit} className="location-form">
          <h3 style={{ marginBottom: "12px", color: "#2c3e50", width: "100%" }}>
            {selectedRoom ? "Edit Meeting Room" : "Create Meeting Room"}
          </h3>

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

          {/* Timing and Status */}
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

          {/* Amenities and Image */}
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label>Amenities:</label>
                <Select
                  options={amenities.map((amenity) => ({
                    value: amenity.name,
                    label: amenity.name,
                  }))}
                  isMulti
                  name="amenities"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={amenities
                    .filter((a) => form.amenities.includes(a.name))
                    .map((a) => ({ value: a.name, label: a.name }))}
                  onChange={(selectedOptions) =>
                    setForm((prev) => ({
                      ...prev,
                      amenities: selectedOptions.map((a) => a.value),
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
                      key={day.abbrev}
                      className={`day-box ${
                        form.availableDays.includes(day.abbrev) ? "selected" : ""
                      }`}
                      onClick={() => handleDayToggle(day.abbrev)}
                    >
                      {day.abbrev}
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

      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </>
  );
};

export default AddRoomModal;