import React from "react";

const to12HourFormat = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, '0')}:${minute}:00 ${ampm}`;
};

const BookingsList = ({ bookings }) => {
  return (
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
          {bookings.map((booking, index) => (
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
  );
};

export default BookingsList;
