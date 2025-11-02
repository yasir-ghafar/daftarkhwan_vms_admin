import React, { useEffect, useState } from "react";
import { getWalletReport } from "../../api/company_api";
import { getUsers } from "../../api/user_api";
import { useParams } from "react-router";
import Loadder from "../../components/loadding";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const to12HourFormat = (dateTime) => {
  if (!dateTime || typeof dateTime !== "string") return "";

  // Extract time part if date is included
  const parts = dateTime.trim().split(" ");
  const timePart = parts.length > 1 ? parts[1] : parts[0];

  if (!timePart || !timePart.includes(":")) return "";

  const [hourStr, minute] = timePart.split(":");
  let hour = parseInt(hourStr, 10);

  if (isNaN(hour) || minute === undefined) return "";

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // convert 0 → 12

  return `${String(hour).padStart(2, "0")}:${minute.padStart(2, "0")} ${ampm}`;
};

const WalletTransactionReport = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔸 Utility function: Safe metadata parser
  const parseMetadata = (raw) => {
    if (!raw || raw === "undefined" || raw === "null") return {};
    try {
      if (typeof raw === "object") return raw;
      return JSON.parse(raw);
    } catch (err) {
      console.warn("Invalid metadata:", raw);
      return {};
    }
  };

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
        start_date: startDate,
        end_date: endDate,
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

  // 🔹 Transform transaction for display/export (reusable)
  const transformTransaction = (txn, index) => {
    const metadata = parseMetadata(txn.metadata);
    return {
      "Sr #": index + 1,
      "Created By": txn.performedByUser?.name || "N/A",
      "Created For": txn.user?.name || "N/A",
      Company: metadata.company || "",
      "Booking Date": metadata.date || "",
      //"Booking Time": new Date(metadata.startTime).toLocaleString(),
      "Booking Time": to12HourFormat(metadata.startTime),
      "Meeting Room": metadata.roomName || "",
      Site: metadata.location || "",
      Slots: metadata.slots || "-",
      "Total Credits": metadata.totalCredits || "-",
      Time: new Date(txn.createdAt).toLocaleString(),
    };
  };

  // 🔹 Excel/CSV Export Handler
  const handleExport = (format = "xlsx") => {
    if (transactions.length === 0) {
      alert("No data available to export.");
      return;
    }

    const exportData = transactions.map(transformTransaction);

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    const fileName = `Wallet_Report_${new Date().toISOString().split("T")[0]}.${format}`;
    if (format === "csv") {
      const csvOutput = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, fileName);
    } else {
      XLSX.writeFile(wb, fileName);
    }
  };

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

        {/* 🔹 Export Buttons */}
        <button
          onClick={() => handleExport("xlsx")}
          style={{
            background: "#28a745",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Export to Excel
        </button>

        <button
          onClick={() => handleExport("csv")}
          style={{
            background: "#17a2b8",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Export to CSV
        </button>
      </div>

      {/* 🔹 Loader */}
      {loading && <Loadder message="Loading transactions, please wait..." />}

      {/* 🔹 Error */}
      {error && <h2 style={{ color: "red" }}>{error}</h2>}

      {/* 🔹 Data Table */}
      {!loading && !error && transactions.length > 0 && (
        <div
          style={{
            maxHeight: "calc(100vh - 180px)", // Adjust based on header/filter height
            overflowY: "auto",
            marginBottom: "2px", // bottom margin from screen
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#f0f0f0", position: "sticky", top: 0, zIndex: 1 }}>
                <th style={cellStyle}>Sr #</th>
                <th style={cellStyle}>Created By</th>
                <th style={cellStyle}>Created For</th>
                <th style={cellStyle}>Company</th>
                <th style={cellStyle}>Booking Date</th>
                <th style={cellStyle}>Booking Time</th>
                <th style={cellStyle}>Meeting Room</th>
                <th style={cellStyle}>Site</th>
                <th style={cellStyle}>Slots</th>
                <th style={cellStyle}>Total Credits</th>
                <th style={cellStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => {
                const t = transformTransaction(txn, index);
                return (
                  <tr key={txn.id}>
                    <td style={cellStyle}>{t["Sr #"]}</td>
                    <td style={cellStyle}>{t["Created By"]}</td>
                    <td style={cellStyle}>{t["Created For"]}</td>
                    <td style={cellStyle}>{t.Company}</td>
                    <td style={cellStyle}>{t["Booking Date"]}</td>
                    <td style={cellStyle}>{t["Booking Time"]}</td>
                    <td style={cellStyle}>{t["Meeting Room"]}</td>
                    <td style={cellStyle}>{t.Site}</td>
                    <td style={cellStyle}>{t.Slots}</td>
                    <td style={cellStyle}>{t["Total Credits"]}</td>
                    <td style={cellStyle}>{t.Time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 No results */}
      {!loading && transactions.length === 0 && !error && (
        <p>No transactions found for the selected filters.</p>
      )}
    </div>
  );
};

export default WalletTransactionReport;