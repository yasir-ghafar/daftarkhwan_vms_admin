import React, { useState, useEffect } from "react";
import "./add_company.css"; // should match the same styles as add_meeting_room.css for consistency
import ErrorPopup from "../../components/error_popup";

const CompanyModal = ({ isOpen, onClose, onSave, selectedCompany }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    contactNumber: "",
    businessType: "",
    webURL: "",
    location: "",
    reference: "",
    billingEmail: "",
    gstNumber: "",
  });

  useEffect(() => {
    if (selectedCompany) {
      setFormData({
        companyName: selectedCompany.companyName || "",
        companyEmail: selectedCompany.companyEmail || "",
        contactNumber: selectedCompany.contactNumber || "",
        businessType: selectedCompany.businessType || "",
        webURL: selectedCompany.webURL || "",
        location: selectedCompany.location || "",
        reference: selectedCompany.reference || "",
        billingEmail: selectedCompany.billingEmail || "",
        gstNumber: selectedCompany.gstNumber || "",
      });
    } else {
      setFormData({
        companyName: "",
        companyEmail: "",
        contactNumber: "",
        businessType: "",
        webURL: "",
        location: "",
        reference: "",
        billingEmail: "",
        gstNumber: "",
      });
    }
  }, [selectedCompany]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const requiredFields = [
      "companyName",
      "companyEmail",
      "contactNumber",
      "webURL",
      "location",
      "reference",
      "billingEmail",
      "gstNumber",
    ];
    return requiredFields.every((field) => formData[field]?.toString().trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setErrorMessage("Please fill all required fields before saving.");
      return;
    }
    try {
      onSave(formData);
    } catch (err) {
      setErrorMessage(err.message || "Failed to save company.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <form onSubmit={handleSubmit} className="location-form">
          <h3 style={{ marginBottom: "12px", color: "#2c3e50", width: "100%" }}>
            {selectedCompany ? "Edit Company" : "Add New Company"}
          </h3>

          {/* Row 1 */}
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label>Company Name:</label>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Company Email:</label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
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
                <label>Contact Number:</label>
                <input
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Business Type (Optional):</label>
                <input
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label>Web URL:</label>
                <input
                  name="webURL"
                  value={formData.webURL}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-column"></div>
          </div>

          {/* Row 4 */}
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label>Location:</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Reference:</label>
                <input
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 5 */}
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label>Billing Email:</label>
                <input
                  type="email"
                  name="billingEmail"
                  value={formData.billingEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>GST Number:</label>
                <input
                  name="gstNumber"
                  value={formData.gstNumber}
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
              <button
                type="submit"
                className="save-btn"
                disabled={!isFormValid()}
              >
                {selectedCompany ? "Update" : "Save"}
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

export default CompanyModal;
