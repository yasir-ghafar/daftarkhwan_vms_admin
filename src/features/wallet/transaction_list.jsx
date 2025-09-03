import React, { useEffect, useState } from "react";
import { getWalletTransactions } from "../../api/company_api";
import { useParams } from "react-router";
import Loadder from "../../components/loadding";

const Transactions = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getWalletTransactions(id);
      console.log(data);
      setTransactions(data.data || []);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [id]);

  const cellStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
  };


  return (
    <div style={{ padding: "20px" }}>
      {/* 🔹 Show loader when fetching */}
      {(loading) && (
        <Loadder
          message={
            loading ? "Loading transactions, please wait..." : "Processing request..."
          }
        />
      )}

      {/* 🔹 Show error if any */}
      {error && <h2 style={{ color: "red" }}>{error}</h2>}

      {/* 🔹 Render table only when we have transactions */}
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
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Amount</th>
              <th style={cellStyle}>Type</th>
              <th style={cellStyle}>Reason</th>
              <th style={cellStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td style={cellStyle}>{txn.id}</td>
                <td style={cellStyle}>{txn.amount}</td>
                <td style={cellStyle}>
                  <span
                    style={{
                      color: txn.type === "credit" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {txn.type}
                  </span>
                </td>
                <td style={cellStyle}>{txn.reason}</td>
                <td style={cellStyle}>
                  {new Date(txn.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

};

export default Transactions;
