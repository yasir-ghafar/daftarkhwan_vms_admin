import React, { useState, useEffect } from "react";
// import { getRooms } from "../../api/rooms_api"; // ⛔️ Commented out API call

// Generate time slots from 9:00 to 21:00 (30 min interval)
const timeSlots = Array.from({ length: 25 }, (_, i) => {
  const hour = String(9 + Math.floor(i / 2)).padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

const BookingForm = ({ isOpen, onClose, locations }) => {
  const [formData, setFormData] = useState({
    date: "",
    location: "",
    meetingRoom: "",
    companyId: "",
    customerId: "",
    startTime: "",
    endTime: ""
  });

  const [meetingRooms, setMeetingRooms] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  // 🔧 Simulated static data instead of API
  const staticRooms = [
    { id: "room1", name: "Conference Room A" },
    { id: "room2", name: "Board Room B" },
    { id: "room3", name: "Zoom Room C" }
  ];

  const staticBookedSlots = [
    { date: "2025-08-04", startTime: "11:00", roomId: "room1" },
    { date: "2025-08-04", startTime: "14:00", roomId: "room2" },
    { date: "2025-08-04", startTime: "16:30", roomId: "room1" }
  ];

  useEffect(() => {
    setMeetingRooms(staticRooms); // 🟢 Set rooms from static list
    setBookedSlots(staticBookedSlots); // 🟢 Set booked slots from static list
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getDisabledTimes = () => {
    if (!formData.date || !formData.meetingRoom) return [];
    return bookedSlots
      .filter(
        b => b.date === formData.date && b.roomId === formData.meetingRoom
      )
      .map(b => b.startTime);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingObject = {
      customerId: formData.customerId,
      companyId: formData.companyId,
      roomId: formData.meetingRoom,
      locationId: formData.location,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime
    };

    console.log("📝 Booking Submitted:", bookingObject); // ✅ View this in browser console

    onClose(); // Close modal after logging
  };

  const disabledTimes = getDisabledTimes();
  const isDateSelected = !!formData.date;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="location-form">
        {/* Top: Date Field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold" }}>Select Date</label><br />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        {/* Rest of the fields (after date is selected) */}
        {isDateSelected && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: "1" }}>
              <label>Location</label><br />
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: "1" }}>
              <label>Meeting Room</label><br />
              <select
                name="meetingRoom"
                value={formData.meetingRoom}
                onChange={handleChange}
                required
              >
                <option value="">Select Room</option>
                {meetingRooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: "1" }}>
              <label>Company ID</label><br />
              <input
                type="text"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ flex: "1" }}>
              <label>Customer ID</label><br />
              <input
                type="text"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ flex: "1" }}>
              <label>Start Time</label><br />
              <select
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              >
                <option value="">Select Time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time} disabled={disabledTimes.includes(time)}>
                    {time} {disabledTimes.includes(time) ? "(Booked)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: "1" }}>
              <label>End Time</label><br />
              <select
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              >
                <option value="">Select Time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time} disabled={disabledTimes.includes(time)}>
                    {time} {disabledTimes.includes(time) ? "(Booked)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="button-group" style={{ marginTop: "30px", textAlign: "center", display: "flex", justifyContent: "center", gap: "20px" }}>
          <button type="submit" className="btn-proceed" disabled={!formData.date}>Proceed</button>
          <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;