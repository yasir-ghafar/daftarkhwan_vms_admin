import React, { useEffect, useState } from "react";
import CompaniesList from "./companies_list";
import CompanyModal from "./add_company";
import { getCompanies } from "../../api/company_api";

const Community = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await getCompanies();
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data?.companies)) list = data.companies;
      else if (Array.isArray(data?.data)) list = data.data;
      setCompanies(list ?? []);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      setError("Failed to load companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCompany(null);
    setModalOpen(true);
  };

  const handleSave = (companyData) => {
    if (selectedCompany) {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === selectedCompany.id
            ? {
                ...c,
                ...companyData,
                name: companyData.companyName ?? c.name,
                locationName: companyData.location ?? c.locationName,
              }
            : c
        )
      );
    } else {
      const newCompany = {
        ...companyData,
        id: Date.now(),
        name: companyData.companyName ?? companyData.name,
        locationName: companyData.location ?? companyData.locationName,
        status: companyData.status ?? "active",
      };
      setCompanies((prev) => [newCompany, ...prev]);
    }
    setModalOpen(false);
    setSelectedCompany(null);
  };

  return (
    <div>
      {/* ✅ Existing search bar now works */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ flex: 1, marginRight: "1rem" }}
        />
        <button onClick={handleAdd} className="btn-add">
          + Add Company
        </button>
      </div>

      {loading && <p>Loading companies...</p>}
      {error && <div className="error-popup"><p>{error}</p></div>}

      {!loading && !error && (
        <CompaniesList
          companies={companies}
          onEdit={handleEdit}
          search={search} // ✅ Pass to list
        />
      )}

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
