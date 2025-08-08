import React, { useEffect, useState } from "react";
import { getCompanies, createCompany } from "../../api/company_api";
import CompaniesList from "./companies_list";
import CompanyModal from "./add_company";

const Companies = () => {
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getCompanies()
      .then((data) => {
        console.log(data.data);
        setCompanies(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching locations:", err);
        setError("Failed to loaxd locations."); // Set error message
        setLoading(false);
      });
  }, []);

  const handleAddCompany = async (newCompany) => {
    console.log(newCompany);
    try {
      const data = await createCompany(newCompany);
      console.log(data);
    } catch (error) {
      alert("Unable to create Company");
    }
  };

  return (
    <>
      <div className="top-bar">
        <h2>Company</h2>
        <button className="add-btn" onClick={() => setModalOpen(true)}>
          Add New
        </button>
      </div>

      <input
        type="text"
        placeholder="Search locations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading && (
        <div className="loading-overlay">
          <div className="loading-dialog">
            <div className="loader"></div>
            <p> Loading please wait....</p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-popup">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && <CompaniesList companies={companies} />}

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddCompany}
      />
    </>
  );
};

export default Companies;
