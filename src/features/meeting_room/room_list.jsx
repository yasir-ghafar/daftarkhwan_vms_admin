import React, { useState, useEffect } from "react";
// import "./room_list.css";

import { useUser } from "../../context/UserContext";

const RoomsList = ({ rooms, onDelete, onEdit, search }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10;

    const { role } = useUser();

  // 🔄 Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  const handleEdit = (room) => {
    if (role === 'admin') {
      onEdit(room);
    } else {
      alert("You are not authorized for this action.");
    }
    
  };

  const handleDelete = (room) => {
    if (role === 'admin') {
      onDelete(room);
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
              <th className="p-4 text-left text-sm justify-start">NAME</th>
              <th className="p-2 text-left text-sm">LOCATION</th>
              <th className="p-2 text-left text-sm">STATUS</th>
              <th className="p-2 text-left text-sm">AVAILABLE SLOTS</th>
              <th className="p-2 text-left text-sm">ACTIONS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRooms.map((room, index) => (
              <tr key={index} className="even:bg-[#f9f9f9] hover:bg-[#f1f5ff]">
                <td className="p-4 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{room.name}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#84878d]">{room.location?.name ?? "N/A"}</td>
                <td className="border-b border-b-gray-300">  
                  <span class="inline-flex mt-2.5  items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-2 text-sm font-semibold text-emerald-700 ">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                    Active
                  </span>
                </td>  
                <td className="p-2 border-b border-b-gray-300 text-left text-md">{room.availableSlotsCount ?? "0"}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEdit(room)}
                  >
                    ✏️
                  </span>
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

export default RoomsList;
