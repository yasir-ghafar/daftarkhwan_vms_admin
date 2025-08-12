import React, { useEffect, useState } from "react";
import { getUsers } from "../../api/user_api";
import UsersList from "./user_list";
import AddUserModal from "./add_new_user";
import DeleteDialog from "../../components/DeleteDialog";
import SuccessPopup from "../../components/confirmation_popup";

const Users = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const fetchUsers = async () => {
    try {
      const userRes = await getUsers();
      setUsers(userRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error opening modal:", err);
      setError("Failed to open modal.");
      setLoading(false);
    }
  }
  // Local-only fetch simulation
  useEffect(() => {
    fetchUsers();
  }, []);

  

  // Add or update user locally
  const handleAddUser = (userData) => {
    setIsLoading(true);
    setModalOpen(false);
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...selectedUser, ...userData } : u
        )
      );
      setSuccessMessage("User updated successfully!");
    } else {
      const newUser = { id: Date.now(), ...userData };
      setUsers((prev) => [...prev, newUser]);
      setSuccessMessage("User created successfully!");
    }
    setSelectedUser(null);
    setIsLoading(false);
  };

  // Open modal for new user
  const openAddNewUser = async () => {
    setIsLoading(true);
    try {
      const userRes = await getUsers();
      setUsers(userRes.data);
      setModalOpen(true);
      setIsLoading(false);
    } catch (err) {
      console.error("Error opening modal:", err);
      setError("Failed to open modal.");
      setIsLoading(false);
    }
  };

  // Edit user
  const handleEdit = async (user) => {
//  `   try {
//       const companyRes = await getUsers();
//       setCompanies(companyRes.data);
//       setSelectedUser(user);
//       setModalOpen(true);
//     } catch (err) {
//       console.error("Error fetching companies:", err);
//       setError("Could not load company data.");
//     }`
  };

  // Delete user locally
  const handleDelete = (user) => {
    setDeleteMessage(`Are you sure you want to delete ${user.name}?`);
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDialogOpen(false);
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setSelectedUser(null);
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  // Filtered users based on search
  // const filteredUsers = users.filter((u) =>
  //   u.name.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div>
      {isLoading && <div className="loading-bar"></div>}
      <div className="top-bar">
        <h2>Users</h2>
        <button className="add-btn" onClick={openAddNewUser}>
          Add New
        </button>
      </div>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {error && (
        <div className="error-popup">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-dialog">
            <div className="loader"></div>
            <p>Loading please wait...</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <UsersList
          users={users}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      <DeleteDialog
        isOpen={isDialogOpen}
        message={deleteMessage}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleAddUser}
        selectedUser={selectedUser}
        isEdit={!!selectedUser}
      />
      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </div>
  );
};

export default Users;
