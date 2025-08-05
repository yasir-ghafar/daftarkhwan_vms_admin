import React, { useEffect, useState } from "react";
import CompaniesList from "./companies_list";
import CompanyModal from "./add_company";

const Community = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    console.log("Community component mounted");

    // Placeholder data — replace with real fetch later
    setCompanies([
      {
        id: 1,
        name: "Acme Corp",
        locationName: "Lahore",
        status: "active",
        companyName: "Acme Corp",
        companyEmail: "info@acme.com",
        contactNumber: "1234567890",
        businessType: "IT",
        webURL: "https://acme.com",
        location: "Lahore",
        reference: "LinkedIn",
        billingEmail: "billing@acme.com",
        gstNumber: "GST123",
        spocName: "John Doe",
        spocEmail: "john@acme.com",
        kycDoc: "acme-kyc.pdf"
      }
    ]);
  }, []);

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCompany(null); // clear for fresh entry
    setModalOpen(true);
  };

  const handleSave = (companyData) => {
    if (selectedCompany) {
      // Update existing company
      setCompanies((prev) =>
        prev.map((comp) =>
          comp.id === selectedCompany.id
            ? { ...comp, ...companyData, name: companyData.companyName, locationName: companyData.location }
            : comp
        )
      );
    } else {
      // Add new company
      const newCompany = {
        ...companyData,
        id: Date.now(),
        name: companyData.companyName,
        locationName: companyData.location,
        status: "active"
      };
      setCompanies((prev) => [...prev, newCompany]);
    }

    setModalOpen(false);
    setSelectedCompany(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button onClick={handleAdd} className="btn-add">+ Add Company</button>
      </div>

      <CompaniesList companies={companies} onEdit={handleEdit} />

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCompany(null);
        }}
        onSave={handleSave}
        selectedCompany={selectedCompany}
      />
    </div>
  );
};

export default Community;