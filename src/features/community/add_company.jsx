import React, { useState, useEffect } from "react";

const CompanyModal = ({ isOpen, onClose, onSave, selectedCompany, isEdit }) => {
  const [activeTab, setActiveTab] = useState("General");
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

    spocName: "",
    spocEmail: "",

    kycDoc: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const tabs = ["General", "Billing Details", "SPOC", "KYC"];

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

        spocName: selectedCompany.spocName || "",
        spocEmail: selectedCompany.spocEmail || "",

        kycDoc: selectedCompany.kycDoc || "",
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

        spocName: "",
        spocEmail: "",

        kycDoc: "",
      });
    }
    setActiveTab("General");
  }, [selectedCompany]);

  const isFieldEmpty = (fields) =>
    fields.some((field) => !formData[field]?.toString().trim());

  const isCurrentTabValid = () => {
    switch (activeTab) {
      case "General":
        return !isFieldEmpty([
          "companyName",
          "companyEmail",
          "contactNumber",
          "webURL",
          "location",
          "reference",
        ]);
      case "Billing Details":
        return !isFieldEmpty(["billingEmail", "gstNumber"]);
      case "SPOC":
        return !isFieldEmpty(["spocName", "spocEmail"]);
      case "KYC":
        return !isFieldEmpty(["kycDoc"]);
      default:
        return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare company data object to send
    const companyData = { ...formData };
    // If kycDoc is a File object, keep it; else if string (existing), keep as is
    if (companyData.kycDoc instanceof File === false && typeof companyData.kycDoc === "string") {
      // do nothing, keep existing string
    } else if (companyData.kycDoc instanceof File) {
      // file selected, keep as is
    } else {
      companyData.kycDoc = null;
    }
    onSave(companyData);
  };

  if (!isOpen) return null;

  return (
    <div className="locations-modal-container">
      <div className="modal-content">
        <h2>{isEdit ? "Edit company" : "Add new company"}</h2>
        <div className="tab-header">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${tab === activeTab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="tab-form">
          {activeTab === "General" && (
            <>
              <div className="form-row">
                <label>
                  Company name
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Company e-mail
                  <input
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Contact number
                  <input
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Business Type (optional)
                  <input
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Web URL
                  <input
                    name="webURL"
                    value={formData.webURL}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Location
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Reference
                  <input
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            </>
          )}

          {activeTab === "Billing Details" && (
            <>
              <div className="form-row">
                <label>
                  Billing Email
                  <input
                    name="billingEmail"
                    type="email"
                    value={formData.billingEmail}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  GST Number
                  <input
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            </>
          )}

          {activeTab === "SPOC" && (
            <>
              <div className="form-row">
                <label>
                  SPOC Name
                  <input
                    name="spocName"
                    value={formData.spocName}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  SPOC Email
                  <input
                    name="spocEmail"
                    type="email"
                    value={formData.spocEmail}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            </>
          )}

          {activeTab === "KYC" && (
            <>
              <div className="form-row">
                <label>
                  KYC Document
                  <input
                    name="kycDoc"
                    type="file"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        kycDoc: e.target.files[0],
                      }))
                    }
                    required={!isEdit || !formData.kycDoc}
                  />
                </label>
                {formData.kycDoc && typeof formData.kycDoc === "string" && (
                  <p>Current document: {formData.kycDoc}</p>
                )}
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            {activeTab !== "KYC" ? (
              <button
                type="button"
                className="btn-next"
                onClick={handleNext}
                disabled={!isCurrentTabValid()}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn-save"
                disabled={!isCurrentTabValid()}
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal;