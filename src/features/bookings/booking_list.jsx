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
  totalItems,
  loading,
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

  const showEmptyState = !loading && sortedBookings.length === 0;

  return (
    <div>
      <div className="rounded-lg overflow-hidden border mx-4 border-gray-300 bg-white shadow-mist-300">
        <table className="w-full border-collapse font-sans">
          <thead className="text-shadow-gray-900 border-b border-b-gray-300">
            <tr>
              <th className="p-4 text-left text-sm justify-start" onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
                Date {getSortIndicator("date")}
              </th>
              <th className="p-2 text-left text-sm">Meeting Room</th>
              <th className="p-2 text-left text-sm">Location</th>
              <th className="p-2 text-left text-sm">Start - End Timings</th>
              <th className="p-2 text-left text-sm">Member</th>
              <th className="p-2 text-left text-sm">Company</th>
              <th className="p-2 text-left text-sm">Status</th>
              <th className="p-2 text-left text-sm">Cancel</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((booking) => (
              <tr key={booking.id} className="even:bg-[#f9f9f9] hover:bg-[#f1f5ff]">
                <td className="p-4 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{booking.date}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{booking.Room?.name}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#84878d]">{booking.Room?.location?.name}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">
                  {to12HourFormat(booking.startTime)} -{" "}
                  {to12HourFormat(booking.endTime)}
                </td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{booking.User?.name}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{booking.User?.Company?.name}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{booking.status.toLowerCase()}</td>
                <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]" style={{ textAlign: "left" }}>
                  <button
                    className="cancel-btn-2"
                    onClick={() => onCancelClick(booking.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {showEmptyState && (
              <tr>
                <td colSpan="8" className="bookings-empty-state">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="relative">
        <div className="flex justify-end bottom-0 mt-20">
          <button
            type="button"
            className=" text-gray-800 font-medium py-2 px-4 rounded-lg cursor-pointer border border-gray-300 bg-gray-100"
            onClick={handlePrev}
            disabled={loading || currentPage <= 1}
          >
            &lt;
          </button>
          <span className="font-md p-2 font-bold text-[#696c70]">
            Page {currentPage} of {totalPages}
            {totalItems > 0 ? ` (${totalItems} total)` : ""}
          </span>
          <button
            type="button"
            className="bg-[#3642ee] text-white font-medium py-2 px-4 rounded-lg cursor-pointer"
            onClick={handleNext}
            disabled={loading || currentPage >= totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsList;
