import React, { useState, useEffect } from "react";
//import './add_modal.css';

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
    lng: ""
  };

  const [formData, setFormData] = useState(initialState);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

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
      });
      setPreview(editData.imageUrl || null);
    } else {
      setFormData(initialState);
      setImage(null);
      setPreview(null);
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
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) {
      data.append("image", image);
    }

    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="locations-modal-container">
      <div className="locations-modal-overlay" onClick={onClose}>
        <div
          className="locations-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="locations-modal-header">
            {editData ? "Edit Location" : "Add New Location"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="locations-location-form"
            encType="multipart/form-data"
          >
            {[
              { key: "name", label: "Name" },
              { key: "contactNumber", label: "Contact Number" },
              { key: "email", label: "Email" },
              { key: "legalBusinessName", label: "Legal Business Name" },
              { key: "address", label: "Address" },
              { key: "city", label: "City" },
              { key: "lat", label: "Latitude"},
              { key: "lng", label: "Longitude"},
            ].map(({ key, label }) => (
              <input
                key={key}
                name={key}
                type="text"
                value={formData[key]}
                onChange={handleChange}
                placeholder={label}
                required
              />
            ))}

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <input type="file" accept="image/*" onChange={handleImageChange} />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: 200,
                  height: 100,
                  objectFit: "cover",
                  marginTop: "10px",
                  borderRadius: "4px",
                }}
              />
            )}

            <div className="locations-modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="btn-save">
                {editData ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddLocationModal;