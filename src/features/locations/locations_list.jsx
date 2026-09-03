import React, { useState, useEffect } from "react";
import "./locations_list.css";

import { useUser } from "../../context/UserContext";

const LocationList = ({ locations, onDelete, onEdit, loading, search }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const locationsPerPage = 10;

  const { role } = useUser();


  // 🔄 Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = locations.slice(indexOfFirstLocation, indexOfLastLocation);

  const totalPages = Math.ceil(locations.length / locationsPerPage);

  const handleDeleteClick = (locationId) => {

    if (role === 'admin') {
        const confirmDelete = window.confirm("Are you sure you want to delete this location?");
      if (confirmDelete) {
      onDelete(locationId);
    }
    } else {
      alert("You are not authorized for this action.");
    }

  };

  const handleEditClick = (location) => {
    if (role === 'admin') {
        onEdit(location);
    } else {
      alert("You are not authorized for this action.");
    }
    
  };

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
      <div className="rounded-lg overflow-hidden border mx-4 border-gray-300 bg-white shadow-mist-300">
        <table className="w-full border-collapse font-sans">
          <thead className="text-shadow-gray-900 border-b border-b-gray-300">
            <tr>
              <th className="p-4 text-left text-sm justify-start">Location Name</th>
              <th className="p-2 text-left text-sm">Location Area</th>
              <th className="p-2 text-left text-sm">Contacts</th>
              <th className="p-2 text-left text-sm">Email</th>
              <th className="p-2 text-left text-sm">Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentLocations.map((loc) => (
              <tr key={loc.id} className="hover:bg-gray-100 cursor-pointer">
                <td className="p-4 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{loc.name}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#84878d]">{loc.city}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{loc.contactNumber}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{loc.email}</td>
                <td className="border-b border-b-gray-300">
                  <span className="edit-icon" onClick={() => handleEditClick(loc)}>✏️</span>
                  <span className="delete-icon" onClick={() => handleDeleteClick(loc.id)}>🗑️</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="relative">
        <div className="flex justify-end bottom-0 mt-20">
          <button
            className="text-gray-800 font-medium py-2 px-4 rounded-lg cursor-pointer border border-gray-300 bg-gray-100"
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

export default LocationList;
