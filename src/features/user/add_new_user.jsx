import "./add_new_user.css";
import React, { useState, useEffect } from "react";

const roles = [
  { value: "member", label: "Member" },
  { value: "poc", label: "POC" }
];

const AddUserModal = ({ isOpen, onClose, onSave, companies, selectedUser }) => {
  const [form, setForm] = useState({
    name: "",
    role: "member",
    email: "",
    company_id: "",
    phoneNumber: "",
    password: ""
  });

  useEffect(() => {
    if (selectedUser) {
      setForm({
        name: selectedUser.name || "",
        role: selectedUser.role || "member",
        email: selectedUser.email || "",
        company_id: selectedUser.company_id?.toString() || "",
        phoneNumber: selectedUser.phoneNumber || "",
        password: "" // Never pre-fill passwords
      });
    } else {
      setForm({
        name: "",
        role: "member",
        email: "",
        company_id: "",
        phoneNumber: "",
        password: ""
      });
    }
  }, [selectedUser]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="location-form">
        <h3 style={{ marginBottom: "12px", color: "#2c3e50", width: "100%" }}>
          {selectedUser ? "Edit User" : "Add New User"}
        </h3>

        {/* Name */}
        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="form-column">
            <div className="form-group">
              <label>Role:</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Email & Company */}
        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label>Company:</label>
              <select
                name="company_id"
                value={form.company_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Phone & Password */}
        <div className="form-row">
          <div className="form-column">
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
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

export default AddUserModal;
