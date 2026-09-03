import React, { useState, useEffect, use } from "react";
import "./user_list.css"; // shared pagination styling
import { useUser } from "../../context/UserContext";


const UsersList = ({ users, onDelete, onEdit, search, onUpdateWallet }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const { role } = useUser();

  // 🔄 Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleEdit = (user) => {
    if (role === 'admin') {
      onEdit(user);
    } else {
      alert("You are not authorized for this action.");
    }
  };

  const handleDelete = (user) => {
    if (role === 'admin') {
      onDelete(user);
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

  const handleWalletUpdate = (user) =>  {
    onUpdateWallet(user);
  }

  return (
    <div>
      <div className="rounded-lg overflow-hidden border mx-4 border-gray-300 bg-white shadow-mist-300">
        <table className="w-full border-collapse font-sans">
          <thead className="text-[#84878d] border-b border-b-gray-300">
            <tr>
              <th className="p-4 text-left text-sm justify-start">Name</th>
              <th className="p-2 text-left text-sm">Email</th>
              <th className="p-2 text-left text-sm">Status</th>
              <th className="p-2 text-left text-sm">Role</th>
              <th className="p-2 text-left text-sm">Company</th>
              <th className="p-2 text-left text-sm">Location</th>
              <th className="p-2 text-left text-sm">Balance</th>
              <th className="p-2 text-left text-sm">Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={index} className="even:bg-[#f9f9f9] hover:bg-[#f1f5ff]">
                <td className="p-4 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{user.name}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#84878d]">{user.email}</td>
                <td className="border-b border-b-gray-300">  
                  <span class="inline-flex mt-2.5  items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-2 text-sm font-semibold text-emerald-700 ">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                    Active
                  </span>
                </td> 
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{user.role}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{user.Company.name || "N/A"}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#84878d]">{user.Company.locationName}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">
                  Meeting Room:{" "}
                  {user.Wallet
                    ? user.Wallet.meeting_room_credits ?? "N/A"
                    : "N/A"}
                  <br />
                  {/* Printing:{" "}
                  {user.Wallet ? user.Wallet.printing_credits ?? "N/A" : "N/A"} */}
                </td>
                <td style={{ textAlign: "left" }}>
                  <button
                    className="py-2 px-2 bg-[#3642ee] text-white rounded-lg"
                    onClick={() => handleWalletUpdate(user)}
                  >
                    Update Wallet
                  </button>
                </td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEdit(user)}
                  >
                    ✏️
                  </span>
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
      <div className="flex justify-between bottom-0 mt-20">
        <div className="text-[#84878d]">Showing 1-__ of __ users</div>
        <div>
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

export default UsersList;
