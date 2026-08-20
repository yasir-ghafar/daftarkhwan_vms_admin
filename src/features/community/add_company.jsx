import React, { useState, useEffect } from "react";
import "./add_company.css"; // should match the same styles as add_meeting_room.css for consistency
import ErrorPopup from "../../components/error_popup";

const emptyForm = {
  name: "",
  email: "",
  contactNumber: "",
  businessType: "",
  webURL: "",
  locationName: "",
  locationId: "",
  reference: "",
  billingEmail: "",
  gstNumber: "",
  status: "active",
};

const resolveLocationId = (company) => {
  const id =
    company?.LocationId ??
    company?.locationId ??
    company?.location_id ??
    company?.location?.id ??
    "";
  return id === null || id === undefined || id === "" ? "" : String(id);
};

const CompanyModal = ({ isOpen, onClose, onSave, selectedCompany, locations = [] }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;

    if (selectedCompany) {
      const locationId = resolveLocationId(selectedCompany);
      const matchedLocation = locations.find(
        (loc) => String(loc.id) === locationId
      );

      setFormData({
        name: selectedCompany.name || "",
        email: selectedCompany.email || "",
        contactNumber: selectedCompany.contactNumber || "",
        businessType: selectedCompany.businessType || "",
        webURL: selectedCompany.websiteUrl || selectedCompany.webURL || "",
        locationName:
          matchedLocation?.name ||
          selectedCompany.location?.name ||
          selectedCompany.locationName ||
          "",
        locationId,
        reference: selectedCompany.reference || "",
        billingEmail: selectedCompany.billingEmail || "",
        gstNumber: selectedCompany.gstNumber || selectedCompany.gstn || "",
        status: (selectedCompany.status || "active").toLowerCase(),
      });
    } else {
      setFormData(emptyForm);
    }
    // Only reset when modal opens or the selected company changes —
    // not when the locations list reference updates mid-edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedCompany]);

  // Once locations load, fill the correct display name for edit mode.
  useEffect(() => {
    if (!isOpen || !selectedCompany || !locations.length) return;

    const locationId = resolveLocationId(selectedCompany);
    if (!locationId) return;

    const matchedLocation = locations.find(
      (loc) => String(loc.id) === locationId
    );
    if (!matchedLocation) return;

    setFormData((prev) => ({
      ...prev,
      locationId,
      locationName: matchedLocation.name,
    }));
  }, [isOpen, selectedCompany, locations]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for location selection
    if (name === "locationId") {
      const selectedLoc = locations.find((loc) => String(loc.id) === value);
      setFormData((prev) => ({
        ...prev,
        locationId: value,
        // Use location display name (e.g. "Alpha"), not legalBusinessName
        locationName: selectedLoc ? selectedLoc.name : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // const isFormValid = () => {
  //   const requiredFields = [
  //     "companyName",
  //     "companyEmail",
  //     "contactNumber",
  //     "locationName",
  //     "billingEmail",
  //     "gstNumber",
  //   ];
  //   return requiredFields.every((field) => formData[field]?.toString().trim());
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const selectedLoc = locations.find(
        (loc) => String(loc.id) === String(formData.locationId)
      );

      // Always resolve display name from location.name — never legalBusinessName.
      // API expects LocationId (capital L), not locationId.
      const payload = {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        businessType: formData.businessType,
        websiteUrl: formData.webURL || formData.websiteUrl || "",
        reference: formData.reference,
        billingEmail: formData.billingEmail,
        gstn: formData.gstNumber || formData.gstn || "",
        LocationId: formData.locationId,
        locationName: selectedLoc?.name || formData.locationName || "",
        status: formData.status,
      };

      onSave(payload);
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
                  name="name"
                  value={formData.name}
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
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Location:</label>
                <select
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={String(loc.id)}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="form-row">
            {/* <div className="form-column">
              <div className="form-group">
                <label>Location:</label>
                <input
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div> */}

            
            {/* <div className="form-column">
              <div className="form-group">
                <label>Reference:</label>
                <input
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  required
                />
              </div>
            </div> */}

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

            <div className="form-column">
              <div className="form-group">
                <label>Billing Email:</label>
                <input
                  type="email"
                  name="billingEmail"
                  value={formData.billingEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>

          {/* Row 5 */}
          <div className="form-row">
            

            <div className="form-column">
              <div className="form-group">
                <label>GST Number:</label>
                <input
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
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
                // disabled={!isFormValid()}
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
