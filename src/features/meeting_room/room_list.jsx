import React, { useState } from "react";
import "./room_list.css"; // Add your pagination CSS here

const RoomsList = ({ rooms, onDelete, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10;

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  const handleEdit = (room) => {
    onEdit(room);
  };

  const handleDelete = (room) => {
    onDelete(room);
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
              <th>Location</th>
              <th>Status</th>
              <th>Available Slots</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRooms.map((room, index) => (
              <tr key={index}>
                <td>{room.name}</td>
                <td>{room.location?.name ?? "N/A"}</td>
                <td>{room.Status ?? "Active"}</td>
                <td>{room.availableSlotsCount ?? "0"}</td>
                <td>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEdit(room)}
                  >
                    ✏️
                  </span>
                </td>
                <td>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(room)}
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

export default RoomsList;
