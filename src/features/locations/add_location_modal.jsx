import React, { useState, useEffect, useRef } from "react";
import ErrorPopup from "../../components/error_popup";

const AddLocationModal = ({ isOpen, onClose, onSave, editData }) => {
  const initialState = {
    name: "",
    contactNumber: "",
    email: "",
    legalBusinessName: "",
    address: "",
    city: "",
    status: "active",
    lat: "",
    lng: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef();

  // Populate form data on edit
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        contactNumber: editData.contactNumber || "",
        email: editData.email || "",
        legalBusinessName: editData.legalBusinessName || "",
        address: editData.address || "",
        city: editData.city || "",
        status: editData.status || "active",
        lat: editData.lat || "0.00",
        lng: editData.lng || "0.00",
      });
      setPreview(editData.imageUrl || null);
      setImage(null);
    } else {
      setFormData(initialState);
      setPreview(null);
      setImage(null);
    }
  }, [editData]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage("Location name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage("City is required.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "image") {
        data.append(key, value);
      }
    });

    if (image) {
      data.append("image", image);
    } else if (editData?.imageUrl) {
      data.append("imageUrl", editData.imageUrl);
    }

    try {
      if (onSave) onSave(data);
    } catch (err) {
      setErrorMessage(err.message || "Failed to save location.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <form onSubmit={handleSubmit} className="location-form">
          <h3 style={{ marginBottom: "12px", color: "#2c3e50", width: "100%" }}>
            {editData ? "Edit Location" : "Add New Location"}
          </h3>

          {/* Row 1 */}
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Contact Number:</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label>Legal Business Name:</label>
                <input
                  type="text"
                  name="legalBusinessName"
                  value={formData.legalBusinessName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label>Latitude:</label>
                <input
                  type="text"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Longitude:</label>
                <input
                  type="text"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 4 - Image Upload */}
          <div className="form-row">
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
              {preview && (
                <div className="image-preview-wrapper">
                  <img
                    src={preview}
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

          {/* Actions */}
          <div className="form-row">
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="save-btn">
                {editData ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Popup */}
      {errorMessage && (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </>
  );
};

export default AddLocationModal;
