import React, { useEffect, useState } from "react";
import "./booking_list.css";// new CSS for cancel button

const to12HourFormat = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${minute}:00 ${ampm}`;
};

const BookingsList = ({ bookings, search, onCancelClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
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
      booking.User?.name,
      booking.User?.Company?.name,
      booking.startTime,
      booking.endTime,
    ].some((field) => normalize(field).includes(searchTerm));
  };

  const filtered = bookings.filter(matchesSearch);

  const totalPages = Math.ceil(filtered.length / bookingsPerPage) || 1;
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filtered.slice(indexOfFirstBooking, indexOfLastBooking);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div>
      <div className="table-container">
        <table className="location-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Meeting Room</th>
              <th>Start - End Timings</th>
              <th>Member</th>
              <th>Company</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.date}</td>
                <td>{booking.Room?.name}</td>
                <td>
                  {to12HourFormat(booking.startTime)} -{" "}
                  {to12HourFormat(booking.endTime)}
                </td>
                <td>{booking.User?.name}</td>
                <td>{booking.User?.Company?.name}</td>
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
                <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
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