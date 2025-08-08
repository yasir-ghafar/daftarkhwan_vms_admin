import React, { useState, useEffect } from "react";
import { getRoomByLocationId } from '../../api/rooms_api';
import { getUsersByCompanyId } from "../../api/authApi";


// Convert 24-hour to 12-hour format with seconds and AM/PM
const to12HourFormat = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, '0')}:${minute}:00 ${ampm}`;
};

//
const toDateTimeString = (date, time) => {
  if (!date || !time) return "";

  // Ensure date is in YYYY-MM-DD
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");

  // Return formatted datetime
  return `${year}-${month}-${day} ${hour}:${minute}:00`;
};

// Generate time slots from 09:00 to 21:30 with 30-min intervals
const timeSlots = Array.from({ length: 25 }, (_, i) => {
  const hour = String(9 + Math.floor(i / 2)).padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

const BookingForm = ({ isOpen, onClose, onSave, locations, companies }) => {
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
  const [users, setUsers] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!formData.companyId) {
        setUsers([]);
        return;
      }

      try {
        const usersRes = await getUsersByCompanyId(formData.companyId);
        const data = usersRes.data;
        setUsers(data)
      } catch (err) {
        console.error("Failed to fetch Users", err);
        setUsers([]);
      }
    };

    fetchUsers();

  },[formData.companyId])

  useEffect(() => {
    const fetchMeetingRooms = async () => {
      if (!formData.location) {
        setMeetingRooms([]);
        return;
      }

      try {
        const res = await getRoomByLocationId(formData.location);
        const data = res.data;
        setMeetingRooms(data);
      } catch (err) {
        console.error("Failed to fetch meeting rooms", err);
        setMeetingRooms([]);
      }
    };

    fetchMeetingRooms();
  }, [formData.location]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getDisabledTimes = () => {
    if (!formData.date || !formData.meetingRoom) return [];
    return bookedSlots
      .filter(b => b.date === formData.date && b.roomId === formData.meetingRoom)
      .map(b => b.startTime);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      date: formData.date,
      startTime: toDateTimeString(formData.date, formData.startTime),
      endTime: toDateTimeString(formData.date, formData.endTime),
      location_id: parseInt(formData.location),
      room_id: parseInt(formData.meetingRoom),
      company_id: parseInt(formData.companyId),
      user_id: parseInt(formData.customerId),
      status: "confirmed"
    };

    console.log("📝 Booking Submitted:", payload);
    onSave(payload);
    onClose();
  };

  const disabledTimes = getDisabledTimes();
  const isDateSelected = !!formData.date;
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="location-form">
        <div style={{ marginBottom: "20px" }}>
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
              <label>Company</label><br />
              <select
              name="companyId"
              value={formData.companyId}
                onChange={handleChange}
                required
              >
              <option value="">Select Company</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
              </select>
            </div>

            <div style={{ flex: "1" }}>
              <label>Member</label><br />
              <select
                type="number"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required>
                <option value="">Select memeber</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            
            </div>

            <div>
              <label><strong>Select Date</strong></label><br />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              />
            </div>

            {isDateSelected && (
              <>
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
                        {to12HourFormat(time)} {disabledTimes.includes(time) ? "(Booked)" : ""}
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
                        {to12HourFormat(time)} {disabledTimes.includes(time) ? "(Booked)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="button-group" style={{ marginTop: "30px", textAlign: "center", display: "flex", justifyContent: "center", gap: "20px" }}>
          <button type="submit" className="btn-proceed" disabled={!formData.date}>Proceed</button>
          <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
