import React from "react";

const CompaniesList = ({ companies }) => {
  return (
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
          {companies.map((company, index) => {
            return (
              <tr key={index}>
                <td>{company.name}</td>
                <td>{company.locationName}</td>
                <td>{company.status}</td>
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


export default CompaniesList;