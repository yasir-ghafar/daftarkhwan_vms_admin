import React, { useEffect, useState } from "react";
import { getUsers, addNewUser, editUser } from "../../api/user_api";
import UsersList from "./user_list";
import AddUserModal from "./add_new_user";
import DeleteDialog from "../../components/DeleteDialog";
import SuccessPopup from "../../components/confirmation_popup";
import Loadder from "../../components/loadding"; // Unified loader component

import AddCreditDialog from "./add_credits_dialog";
import { updateWalletBalance } from "../../api/company_api";

const Users = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWalletDialogOpen, setWalletDialogOpen] = useState(false);
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



const handleAddUser = async (userData) => {
  setIsLoading(true);
  setModalOpen(false);

  try {
    if (selectedUser) {
      // Call backend update API
      const updatedUser = await editUser(selectedUser.id, userData);

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? updatedUser : u))
      );
      setSuccessMessage("User updated successfully!");
    } else {
      // Call backend create API
      const newUser = await addNewUser(userData);

      // Add to local state
      setUsers((prev) => [...prev, newUser]);
      setSuccessMessage("User created successfully!");
    }
  } catch (error) {
    console.error("Error in handleAddUser:", error);
    setError("Something went wrong!");
  } finally {
    setSelectedUser(null);
    setIsLoading(false);
  }
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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  }

  const handleWalletUpdate = (user) => {
    setSelectedUser(user);
    setWalletDialogOpen(true);
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
      user.Company?.name?.toLowerCase().includes(searchTerm) ||
      user.Company.locationName.toLowerCase().includes(searchTerm) ||
      user.companyName?.toLowerCase().includes(searchTerm)
    );
  });

  /// Method to update wallet balance for User
  const handleWalletSave = async (data) => {
    console.log(data);
    setLoading(true)
    try {
      const walletId = selectedUser.Wallet.id
      const response = await updateWalletBalance(walletId, data);
      console.log(response);
      fetchUsers();
    } catch(err) {
      setError("Failed to Update Wallet Balance.");
    } finally {
      setLoading(false);
      setWalletDialogOpen(false);
    }
  }


  const handleHistoryClick = async (id) => {
    console.log("Wallet Id: ", id);
    window.open(`/transactions/${id}`, "_blank");
    
  }
  return (
    <div>
      {(loading || isLoading) && (
        <Loadder
          message={
            loading ? "Loading users, please wait..." : "Processing request..."
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
        <UsersList
          users={filteredUsers}
          onDelete={handleDelete}
          onEdit={handleEditUser}
          onUpdateWallet={handleWalletUpdate}
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

      <AddCreditDialog
        open={isWalletDialogOpen}
        onClose={() => setWalletDialogOpen(false)}
        onSave={handleWalletSave}
        onHistory={handleHistoryClick}
        user={selectedUser}
        
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
