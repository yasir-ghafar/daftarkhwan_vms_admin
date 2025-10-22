import React, { useEffect, useState } from "react";
import { getWalletTransactions, getWalletReport } from "../../api/company_api"; // ✅ assuming getAllUsers exists
import { getUsers } from "../../api/user_api";
import { useParams } from "react-router";
import Loadder from "../../components/loadding";

const WalletTransactionReport = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // 🔹 Fetch transactions based on filters
  const fetchTransactions = async () => {
    if (!selectedUser) {
      alert("Please select a user first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const params = {
        user_id: selectedUser,
      };
      const data = await getWalletReport(params);
      setTransactions(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const cellStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header filters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          background: "#f9f9f9",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        {/* User dropdown */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email || `User ${user.id}`}
            </option>
          ))}
        </select>

        {/* Start Date */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />

        {/* End Date */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />

        {/* Get Report Button */}
        <button
          onClick={fetchTransactions}
          style={{
            background: "#007bff",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Get Report
        </button>
      </div>

      {/* 🔹 Show loader */}
      {loading && (
        <Loadder message="Loading transactions, please wait..." />
      )}

      {/* 🔹 Show error if any */}
      {error && <h2 style={{ color: "red" }}>{error}</h2>}

      {/* 🔹 Show table if we have data */}
      {/* 🔹 Show table if we have data */}
      {!loading && !error && transactions.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={cellStyle}>Sr #</th>
              <th style={cellStyle}>Created By</th>
              <th style={cellStyle}>Created For</th>
              <th style={cellStyle}>Company</th>
              <th style={cellStyle}>Booking Date</th>
              <th style={cellStyle}>Meeting Room</th>
              <th style={cellStyle}>Site</th>
              <th style={cellStyle}>Slots</th>
              <th style={cellStyle}>Total Credits</th>
              <th style={cellStyle}>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => {
              // ✅ Safely parse metadata JSON
              let metadata = {};
              try {
                if (txn.metadata && txn.metadata !== "undefined" && txn.metadata !== "null") {
                  metadata = JSON.parse(txn.metadata);
                }
              } catch (e) {
                console.error("Invalid metadata JSON:", txn.metadata, e);
              }

              return (
                <tr key={txn.id}>
                  <td style={cellStyle}>{index + 1}</td>
                  <td style={cellStyle}>{txn.performedByUser?.name || "N/A"}</td>
                  <td style={cellStyle}>{txn.user?.name || "N/A"}</td>
                  <td style={cellStyle}>{metadata.company ?? ""}</td>
                  <td style={cellStyle}>{metadata.date ?? ""} </td>
                  <td style={cellStyle}>{metadata.roomName}</td>
                  <td style={cellStyle}>{metadata.location}</td>
                  <td style={cellStyle}>{metadata.slots ?? "-"}</td>
                  <td style={cellStyle}>{metadata.totalCredits ?? "-"}</td>
                  <td style={cellStyle}>
                    {new Date(txn.createdAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}


      {/* 🔹 Show no results */}
      {!loading && transactions.length === 0 && !error && (
        <p>No transactions found for the selected filters.</p>
      )}
    </div>
  );
};

export default WalletTransactionReport;
