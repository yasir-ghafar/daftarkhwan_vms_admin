import React, { useState } from "react";
import "./booking_list.css"; // we'll create this for styling

const to12HourFormat = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, '0')}:${minute}:00 ${ampm}`;
};

const BookingsList = ({ bookings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
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
                <td>{to12HourFormat(booking.startTime)} - {to12HourFormat(booking.endTime)}</td>
                <td>{booking.User?.name}</td>
                <td>{booking.User?.Company?.name}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
