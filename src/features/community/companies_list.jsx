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
      <div className="rounded-lg overflow-hidden border mx-4 border-gray-300 bg-white shadow-mist-300">
        <table className="w-full border-collapse font-sans">
          <thead className="text-shadow-gray-900 border-b border-b-gray-300">
            <tr>
              <th className="p-4 text-left text-sm justify-start">Company Name</th>
              <th className="p-2 text-left text-sm">Location</th>
              <th className="p-2 text-left text-sm">Status</th>
              <th className="p-2 text-left text-sm">Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentCompanies.map((company, index) => (
              <tr key={index} className="even:bg-[#f9f9f9] hover:bg-[#f1f5ff]">
                <td className="p-4 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{company.name ?? company.companyName ?? "—"}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#84878d]">
                  {company.location?.name ??
                    company.locationName ??
                    company.city ??
                    company.location ??
                    "N/A"}
                </td>
                <td className="border-b border-b-gray-300">  
                  <span class="inline-flex mt-2.5  items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-2 text-sm font-semibold text-emerald-700 ">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                    Active
                  </span>
                </td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md">  
                  <td className="edit-icon" onClick={() => handleEditClick(company)}>✏️</td>
                  <td className="edit-icon" onClick={() => handleDeleteClick(company)}>🗑️</td>
                </td>
              </tr>
            ))}
            {currentCompanies.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "left", padding: "1rem" }}>
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="relative">
        <div className="flex justify-end bottom-0 mt-20">  
          <button
            className=" text-gray-800 font-medium py-2 px-4 rounded-lg cursor-pointer border border-gray-300 bg-gray-100"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <span className="font-md p-2 font-bold text-[#696c70]">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            className="bg-[#3642ee] text-white font-medium py-2 px-4 rounded-lg cursor-pointer"
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompaniesList;
