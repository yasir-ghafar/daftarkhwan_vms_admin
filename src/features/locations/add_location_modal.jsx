import React, { useState } from "react";
//import './add_modal.css';

const AddLocationModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    legalBusinessName: "",
    address: "",
    state: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="">
      <div className="modal-overlay">
        <h2>Add New Location</h2>
        <form onSubmit={handleSubmit} className="location-form">
          {Object.entries(formData).map(([key, val]) => (
            <input
              key={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              required
            />
          ))}
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


export default AddLocationModal;