import React, { useState, useEffect } from "react";
import "./locations_list.css";

const LocationList = ({ locations, onDelete, onEdit, loading, search }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const locationsPerPage = 10;

  // 🔄 Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = locations.slice(indexOfFirstLocation, indexOfLastLocation);

  const totalPages = Math.ceil(locations.length / locationsPerPage);

  const handleDeleteClick = (locationId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this location?");
    if (confirmDelete) {
      onDelete(locationId);
    }
  };

  const handleEditClick = (location) => {
    onEdit(location);
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
      <div className="table-container">
        <table className="location-table">
          <thead>
            <tr>
              <th>Location Name</th>
              <th>Location Area</th>
              <th>Contacts</th>
              <th>Email</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentLocations.map((loc) => (
              <tr key={loc.id}>
                <td>{loc.name}</td>
                <td>{loc.city}</td>
                <td>{loc.contactNumber}</td>
                <td>{loc.email}</td>
                <td className="edit-icon" onClick={() => handleEditClick(loc)}>✏️</td>
                <td className="edit-icon" onClick={() => handleDeleteClick(loc.id)}>🗑️</td>
              </tr>
            ))}
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
          {currentPage} / {totalPages || 1}
        </span>
        <button
          className="pagination-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default LocationList;
