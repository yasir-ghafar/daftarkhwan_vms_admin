import React, { useState, useEffect } from "react";
import "./user_list.css"; // shared pagination styling

const UsersList = ({ users, onDelete, onEdit, search }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // 🔄 Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleEdit = (user) => {
    onEdit(user);
  };

  const handleDelete = (user) => {
    onDelete(user);
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
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.company_name ||
                    user.company?.name ||
                    user.companyName ||
                    (typeof user.company === "string" ? user.company : null) ||
                    "N/A"}
                </td>
                <td>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEdit(user)}
                  >
                    ✏️
                  </span>
                </td>
                <td>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(user)}
                  >
                    🗑️
                  </span>
                </td>
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

export default UsersList;
