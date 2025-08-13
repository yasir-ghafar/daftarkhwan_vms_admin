import React, { useState } from "react";
import "./companies_list.css"; // shared styling for all lists

const CompaniesList = ({ companies, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 10;

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);

  const totalPages = Math.ceil(companies.length / companiesPerPage) || 1;

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
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
                <td>{company.name}</td>
                <td>{company.locationName}</td>
                <td>{company.status}</td>
                <td
                  className="edit-icon"
                  onClick={() => onEdit(company)}
                >
                  ✏️
                </td>
                <td className="edit-icon">🗑️</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls (always visible) */}
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
