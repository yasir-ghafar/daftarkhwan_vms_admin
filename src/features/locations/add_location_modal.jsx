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

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChnage = (e) => {
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
    if (key !== "image") data.append(key, value);
  });

  if (image) {
    data.append("image", image);
  }
    console.log(data);
     onSave(data);
     onClose();

    

  };

  if (!isOpen) return null;

  return (
    <div className="locations-modal-container">
      <div className="locations-modal-overlay">
        <div className="locations-modal-content">
          <h2 className="locations-modal-header">Add New Location</h2>
          <form
            onSubmit={handleSubmit}
            className="locations-location-form"
            encType="multipart/form-data"
          >
           {Object.entries(formData).map(([key, val]) => (
  key === "image" ? (
    <input
      key={key}
      name={key}
      type="file"
      accept="image/*"
      onChange={handleImageChange} // handle file upload separately
      required
    />
  ) : (
    <input
      key={key}
      name={key}
      type="text"
      value={val}
      onChange={handleChange}
      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
      required
    />
  )
))}
            {/* File Input */}
            <input type="file" accept="image/*" onChange={handleImageChnage} />
            {/* Image Preview */}
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
    </div>
  );
};

export default AddLocationModal;