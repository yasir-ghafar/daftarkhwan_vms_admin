import React from "react";

const LocationList = ({locations}) => {

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
              {locations.map((loc, index) => {
                return (
                  <tr key={index}>
                    <td>{loc.name}</td>
                    <td>{loc.city}</td>
                    <td>{loc.contactNumber}</td>
                    <td>{loc.email}</td>
                    <td className="edit-icon">✏️</td>
                    <td className="edit-icon">🗑️</td>
                  </tr>
                );
              })}
            </tbody>
      </table>
    </div>
  );
};

export default LocationList;
