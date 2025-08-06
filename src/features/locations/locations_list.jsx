import React from "react";

const LocationList = ({ locations, onDelete, onEdit, loading }) => {
  const handleDeleteClick = (locationId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this location?");
    if (confirmDelete) {
      onDelete(locationId);
    }
  };

  const handleEditClick = (location) => {
    onEdit(location);
  };

  return (
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
          {locations.map((loc) => (
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
  );
};

export default LocationList;
