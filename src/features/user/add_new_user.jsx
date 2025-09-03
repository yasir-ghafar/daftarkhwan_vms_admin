import "./add_new_user.css";
import React, { useState, useEffect } from "react";
import ErrorPopup from "../../components/error_popup";
import SuccessPopup from "../../components/confirmation_popup";
import { getCompanies } from "../../api/company_api";
import daftarkhwanApi from "../../api/api";

const roles = [
  { value: "member", label: "Member" },
  { value: "poc", label: "POC" }
];

const AddUserModal = ({ isOpen, onClose, onSave, selectedUser }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  
  
  useEffect(() => {
    const fetchCompanies = async () => {

      try {
        const data = await getCompanies();
        console.log("Fetched companies:", data);
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data?.companies)) {
          list = data.companies;
        } else if (Array.isArray(data?.data)) {
          list = data.data;
        }
        setCompanies(list);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
      }
    };
    fetchCompanies();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
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

    setIsLoading(true);
    try {
      const userObject = {
        name: form.name,
        role: form.role,
        email: form.email,
        company_id: form.company_id,
        phoneNumber: form.phoneNumber,
        password: form.password
      };
      console.log("User object to be saved:", userObject);
      if (!selectedUser) {
        const res = await daftarkhwanApi.post("/auth/register", userObject);
        console.log("User saved to backend:", res.data);
        setSuccessMessage("User created successfully!");
        if (onSave) onSave(res.data);
      } else {
        // If editing existing user, keep previous behavior if needed
        // Currently no update API call is done here
        if (onSave) onSave(userObject);
        setSuccessMessage("User updated successfully!");
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to save user to backend:", err);

      let errorMsg = "Failed to save user.";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data;
        } else if (typeof err.response.data.message === "string") {
          errorMsg = err.response.data.message;
        } else {
          errorMsg = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setErrorMessage(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <div className="loading-bar"></div>}
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
                  {Array.isArray(companies) && companies.map((c) => (
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
                  required={!selectedUser} // Only required for new users
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
      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </>
  );
};

export default AddUserModal;