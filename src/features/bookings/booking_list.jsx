import React, { useEffect, useState } from "react";
import "./booking_list.css";

const to12HourFormat = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

const BookingsList = ({ bookings, search, onCancelClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // 🆕
  const bookingsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const normalize = (v) =>
    v === null || v === undefined ? "" : String(v).toLowerCase();
  const searchTerm = normalize(search).trim();

  const matchesSearch = (booking) => {
    if (!searchTerm) return true;
    return [
      booking.date,
      booking.Room?.name,
      booking.Room.location.name,
      booking.User?.name,
      booking.User?.Company?.name,
      booking.startTime,
      booking.endTime,
    ].some((field) => normalize(field).includes(searchTerm));
  };

  const filtered = bookings.filter(matchesSearch);

  // 🆕 Sorting logic
  const sortedBookings = React.useMemo(() => {
    if (!sortConfig.key) return filtered;

    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date sorting (convert to Date objects)
      if (sortConfig.key === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filtered, sortConfig]);

  const totalPages = Math.ceil(sortedBookings.length / bookingsPerPage) || 1;
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // 🆕 Handle sorting on header click
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // toggle direction
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        // default to ascending
        return { key, direction: "asc" };
      }
    });
  };

  // 🆕 Visual indicator for sorting
  const getSortIndicator = (key) => {
  if (sortConfig.key !== key) return <strong>⇅</strong>;
  return (
    <strong>{sortConfig.direction === "asc" ? "↑" : "↓"}</strong>
  );
};

  return (
    <div>
      <div className="table-container">
        <table className="location-table">
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
            {currentBookings.map((booking, index) => (
              <tr key={index}>
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
            {currentBookings.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "1rem" }}>
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
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span className="pagination-info">
          {currentPage} / {totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default BookingsList;
