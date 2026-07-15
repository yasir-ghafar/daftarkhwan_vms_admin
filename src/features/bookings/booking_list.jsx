import React, { useMemo, useState } from "react";
import "./booking_list.css";

const to12HourFormat = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

const BookingsList = ({
  bookings,
  currentPage,
  totalPages,
  onPageChange,
  onCancelClick,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedBookings = useMemo(() => {
    if (!sortConfig.key) return bookings;

    return [...bookings].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [bookings, sortConfig]);

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return <strong>⇅</strong>;
    return <strong>{sortConfig.direction === "asc" ? "↑" : "↓"}</strong>;
  };

  return (
    <div className="bookings-list">
      <div className="table-container">
        <table className="location-table bookings-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
                Date {getSortIndicator("date")}
              </th>
              <th>Meeting Room</th>
              <th>Location</th>
              <th>Start - End Timings</th>
              <th>Member</th>
              <th>Company</th>
              <th>Status</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.date}</td>
                <td>{booking.Room?.name}</td>
                <td>{booking.Room?.location?.name}</td>
                <td>
                  {to12HourFormat(booking.startTime)} -{" "}
                  {to12HourFormat(booking.endTime)}
                </td>
                <td>{booking.User?.name}</td>
                <td>{booking.User?.Company?.name}</td>
                <td>{booking.status.toLowerCase()}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="cancel-btn-2"
                    onClick={() => onCancelClick(booking.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {sortedBookings.length === 0 && (
              <tr>
                <td colSpan="8" className="bookings-empty-state">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <button
          className="pagination-btn"
          onClick={handlePrev}
          disabled={currentPage <= 1}
        >
          &lt;
        </button>
        <span className="pagination-info">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          className="pagination-btn"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default BookingsList;
