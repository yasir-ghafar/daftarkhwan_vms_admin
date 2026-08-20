import React, { useEffect, useState } from "react";
import { getCompanies, createCompany, editCompany } from "../../api/company_api";
import CompaniesList from "./companies_list";
import CompanyModal from "./add_company";
import { getLocations } from "../../api/locations_api";

import { useUser } from "../../context/UserContext";

const Companies = () => {
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const { role } = useUser();

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

  const fetchLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchLocations();
  }, []);

  const filteredCompanies = companies.filter((company) => {
  const searchTerm = search.toLowerCase();

  const matchesSearch =
    company.name?.toLowerCase().includes(searchTerm) ||
    company.locationName?.toLowerCase().includes(searchTerm) ||
    company.location?.name?.toLowerCase().includes(searchTerm);

  const matchesLocation = selectedLocation
    ? String(company.LocationId) === String(selectedLocation)
    : true;

  const matchesStatus = selectedStatus
    ? (company.status || "active").toLowerCase() === selectedStatus.toLowerCase()
    : true;

  return matchesSearch && matchesLocation && matchesStatus;
  });

  const handleAddCompany = async (newCompany) => {
    setLoading(true);
    console.log(newCompany);
    try {
      // Ensure LocationId + location display name (not legalBusinessName) are sent
      const locationId =
        newCompany.LocationId ?? newCompany.locationId ?? "";
      const matchedLocation = locations.find(
        (loc) => String(loc.id) === String(locationId)
      );

      const payload = {
        ...newCompany,
        LocationId: locationId,
        locationName: matchedLocation?.name || newCompany.locationName || "",
      };

      if (selectedCompany) {
        const res = await editCompany(selectedCompany.id, payload);
        console.log("Company updated:", res.data);
      } else {
        const res = await createCompany(payload);
        console.log("Company created:", res.data);
      }

      await fetchCompanies();
      setModalOpen(false);
      setSelectedCompany(null);
    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
      alert("Unable to save company");
    } finally {
      setLoading(false);
    }
  };

  const openAddCompanyDialog = async () => {
    setSelectedCompany(null);
    if (role === 'admin') {
      setLoading(true);
    try{
      const data = await getLocations();
      setLocations(data.data);
      setModalOpen(true);
    } catch(err) {
      console.error("Error opening modal:", err);
      setError("Failed to open modal.");
    } finally {
      setLoading(false)
    }
    } else {
      alert("You are not authorized for this action.");
    }



    
  }

  const handleEditCompany = async (company) => {
    setLoading(true);
    try {
      if (!locations || locations.length === 0) {
      const data = await getLocations();
      setLocations(data.data);
    }
    console.log(company);
    setSelectedCompany(company);
    setModalOpen(true);
    } catch(err) {
      console.error("Error opening modal:", err);
      setError("Failed to open modal.");
    } finally {
      setLoading(false);
    }
    
  }
  return (
    <>
      <div className="top-bar">
        <h2>Company</h2>
        <button className="add-btn" onClick={openAddCompanyDialog}>
          Add New
        </button>
      </div>
      
      <div className="filters-bar">
        <input
        type="text"
        placeholder="Search locations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

        {/* Location Filter */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

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
      companies={filteredCompanies}
      onEdit={handleEditCompany} />}

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCompany(null);
        }}
        onSave={handleAddCompany}
        locations={locations}
        selectedCompany={selectedCompany}
      />
    </>
  );
};

export default Companies;
