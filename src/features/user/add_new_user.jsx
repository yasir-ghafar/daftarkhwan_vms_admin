import "./add_new_user.css";
import React, { useState, useEffect } from "react";
import ErrorPopup from "../../components/error_popup";
import SuccessPopup from "../../components/confirmation_popup";
import { getCompanies } from "../../api/company_api";

const roles = [
  { value: "admin", label: "admin"},
  { value: "member", label: "Member" },
  { value: "poc", label: "POC" }
];

const AddUserModal = ({ isOpen, onClose, onSave, selectedUser }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    name: "",
    role: "member",
    email: "",
    company_id: "",
    phoneNumber: "",
    password: "",
    credit_types: "postpaid"
  });

  // fetch companies when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.companies)) list = data.companies;
        else if (Array.isArray(data?.data)) list = data.data;

        setCompanies(list);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
      }
    };
    fetchCompanies();
  }, [isOpen]);

  // prefill form when editing
  useEffect(() => {
    if (selectedUser) {
      setForm({
        name: selectedUser.name || "",
        role: selectedUser.role || "member",
        email: selectedUser.email || "",
        company_id: selectedUser.company_id?.toString() || "",
        phoneNumber: selectedUser.phoneNumber || "",
        password: "", // never pre-fill passwords
        credit_types: selectedUser.credit_types || "postpaid"
      });
    } else {
      setForm({
        name: "",
        role: "member",
        email: "",
        company_id: "",
        phoneNumber: "",
        password: "",
        credit_types: "postpaid"
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

    // simple validation
    if (!form.name.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }
    if (!form.email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }
    if (!form.company_id) {
      setErrorMessage("Please select a company.");
      return;
    }
    if (!form.phoneNumber.trim()) {
      setErrorMessage("Phone number is required.");
      return;
    }
    if (!selectedUser && !form.password.trim()) {
      setErrorMessage("Password is required for new users.");
      return;
    }

    // hand over form data to parent
    if (onSave) onSave(form);
  };

  return (
    <>
      <div className="modal-overlay">
        <form onSubmit={handleSubmit} className="location-form">
          <h3 style={{ marginBottom: "12px", color: "#2c3e50", width: "100%" }}>
            {selectedUser ? "Edit User" : "Add New User"}
          </h3>

          {/* Name & Role */}
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

            <div className="form-column">
              <div className="form-group">
                <label>Credits Type:</label>
                <select
                  name="credit_types"
                  value={form.credit_types}
                  onChange={handleChange}
                  required
                >
                  <option value="prepaid">Prepaid</option>
                  <option value="postpaid">Postpaid</option>
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
                  required={!selectedUser} // only required for new users
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

      {/* Error Popup */}
      <ErrorPopup message={errorMessage} onClose={() => setErrorMessage("")} />
    </>
  );
};

export default AddUserModal;
