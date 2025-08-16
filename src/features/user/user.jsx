import React, { useEffect, useState } from "react";
import { getUsers } from "../../api/user_api";
import UsersList from "./user_list";
import AddUserModal from "./add_new_user";
import DeleteDialog from "../../components/DeleteDialog";
import SuccessPopup from "../../components/confirmation_popup";
import Loadder from "../../components/loadding"; // Unified loader component

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
    setLoading(true);
    try {
      const userRes = await getUsers();
      setUsers(userRes.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const openAddNewUser = async () => {
    setIsLoading(true);
    try {
      const userRes = await getUsers();
      setUsers(userRes.data);
      setModalOpen(true);
    } catch (err) {
      console.error("Error opening modal:", err);
      setError("Failed to open modal.");
    } finally {
      setIsLoading(false);
    }
  };

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

  // 🔍 Filter users before sending to UsersList
  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.role?.toLowerCase().includes(searchTerm) ||
      user.company_name?.toLowerCase().includes(searchTerm) ||
      user.company?.name?.toLowerCase().includes(searchTerm) ||
      user.companyName?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div>
      {(loading || isLoading) && (
        <Loadder
          message={
            loading
              ? "Loading users, please wait..."
              : "Processing request..."
          }
        />
      )}

      <div className="top-bar">
        <h2>Users</h2>
        <button className="add-btn" onClick={openAddNewUser}>
          Add New
        </button>
      </div>

      {/* 🔍 Search bar */}
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

      {!loading && !error && (
        <UsersList users={filteredUsers} onDelete={handleDelete} onEdit={() => {}} />
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
