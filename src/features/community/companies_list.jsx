import React, { useEffect, useState } from "react";
import "./companies_list.css";

import { useUser } from "../../context/UserContext";

const CompaniesList = ({ companies, onEdit, search }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 10;

  const { role } = useUser();
  

  useEffect(() => {
    setCurrentPage(1); // reset when search changes
  }, [search]);

  const normalize = (v) =>
    v === null || v === undefined ? "" : String(v).toLowerCase();
  const searchTerm = normalize(search).trim();

  const matchesSearch = (c) => {
    if (!searchTerm) return true;
    return [
      c.name, c.companyName, c.company_name,
      c.locationName, c.location?.name, c.city, c.location,
      c.status,
      c.companyEmail, c.email, c.billingEmail,
      c.contactNumber, c.phone,
      c.webURL, c.website,
      c.businessType, c.industry, c.reference, c.gstNumber,
      c.spocName, c.spocEmail,
    ].some((field) => normalize(field).includes(searchTerm));
  };

  const filtered = companies.filter(matchesSearch);

  const totalPages = Math.ceil(filtered.length / companiesPerPage) || 1;
  const indexOfLast = currentPage * companiesPerPage;
  const indexOfFirst = indexOfLast - companiesPerPage;
  const currentCompanies = filtered.slice(indexOfFirst, indexOfLast);


  const handleEditClick = (company) => {
    if (role === 'admin') {
        onEdit(company);
    } else {
      alert("You are not authorized for this action.");
    }
  }

  const handleDeleteClick = (company) => {

    if (role === 'admin') {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
      if (confirmDelete) {
      onDelete(company.id);
    }
    } else {
      alert("You are not authorized for this action.");
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div>
      <div className="table-container">
        <table className="location-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentCompanies.map((company, index) => (
              <tr key={index}>
                <td>{company.name ?? company.companyName ?? "—"}</td>
                <td>
                  {company.locationName ??
                    company.location?.name ??
                    company.city ??
                    company.location ??
                    "N/A"}
                </td>
                <td>{company.status ?? "active"}</td>
                <td className="edit-icon" onClick={() => handleEditClick(company)}>✏️</td>
                <td className="edit-icon" onClick={() => handleDeleteClick(company)}>🗑️</td>
              </tr>
            ))}
            {currentCompanies.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-container">
        <button
          className="pagination-btn"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span className="pagination-info">
          {currentPage} / {totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default CompaniesList;
