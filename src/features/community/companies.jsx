import React, { useEffect, useState } from "react";
import { getCompanies, createCompany } from "../../api/company_api";
import CompaniesList from "./companies_list";
import CompanyModal from "./add_company";
import { getLocations } from "../../api/locations_api";

const Companies = () => {
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);


  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await getCompanies();
      setCompanies(res.data);
    } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to load companies."); // Set error message
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddCompany = async (newCompany) => {
    setLoading(true)
    console.log(newCompany);
    try {
      const data = await createCompany(newCompany);
      console.log(data);

      await fetchCompanies();
    } catch (error) {
      console.error("Save failed:", err.response?.data || err.message);
      alert("Unable to save meeting room");
    } finally {
      setLoading(false)
    }
  };

  const openAddCompanyDialog = async () => {
    setLoading(true);
    try{
      const data = await getLocations();
      setLocations(data.data);
      setModalOpen(true);
    }catch(err) {
      console.error("Error opening modal:", err);
      setError("Failed to open modal.");
    } finally {
      setLoading(false)
    }
  }

  const handleEditCompany = async (company) => {
    setSelectedCompany(company);
    setModalOpen(true);
  }
  return (
    <>
      <div className="top-bar">
        <h2>Company</h2>
        <button className="add-btn" onClick={openAddCompanyDialog}>
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

      {!loading && !error && <CompaniesList 
      companies={companies}
      onEdit={handleEditCompany} />}

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddCompany}
        locations={locations}
        selectedCompany={selectedCompany}
      />
    </>
  );
};

export default Companies;
