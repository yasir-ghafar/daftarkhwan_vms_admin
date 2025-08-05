import React from "react";

const BookingsList = ({bookings}) => {
    
    
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
            <th></th>
          </tr>
        </thead>
        <tbody>
              {bookings.map((booking, index) => {
                return (
                  <tr key={index}>
                    <td>{booking.date}</td>
                    <td>{booking.Room.name}</td>
                    <td> {booking.startTime} - {booking.endTime}</td>
                    <td>{booking.User.name}</td>
                    <td>{booking.User.Company.name}</td>
                  </tr>
                );
              })}
            </tbody>
      </table>
    </div>
  );
}


export default BookingsList;