import React, { useState, useEffect } from "react";
import { getRoomByLocationId } from "../../api/rooms_api";
import { getUsersByCompanyId } from "../../api/authApi";
import ErrorPopup from "../../components/error_popup";
import SuccessPopup from "../../components/confirmation_popup";

// Convert 24-hour to 12-hour format with seconds and AM/PM
const to12HourFormat = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${minute}:00 ${ampm}`;
};

// Convert date + time to full string
const toDateTimeString = (date, time) => {
  if (!date || !time) return "";
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");
  return `${year}-${month}-${day} ${hour}:${minute}:00`;
};

// Generate time slots from 09:00 to 21:30 with 30-min intervals
const timeSlots = Array.from({ length: 25 }, (_, i) => {
  const hour = String(9 + Math.floor(i / 2)).padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const hhmmToMinutes = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const minutesToHHmm = (minutes) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const getMinStartMinutesForDate = (date) => {
  if (date !== getTodayDate()) return 0;

  const now = new Date();
  let current = now.getHours() * 60 + now.getMinutes();

  if (current % 30 === 0) {
    current += 30;
  } else {
    current += 30 - (current % 30);
  }

  return current;
};

const getEndTimeOptions = (startTime, roomSlots) => {
  if (!startTime || !roomSlots?.length) return [];

  const startMinutes = hhmmToMinutes(startTime);

  const endBoundaries = new Set(
    roomSlots.map((slot) => slot.endMinutes).filter((end) => end > startMinutes)
  );

  return [...endBoundaries]
    .sort((a, b) => a - b)
    .filter((endMinutes) => {
      const overlapsBooked = roomSlots.some(
        (slot) =>
          slot.isBooked &&
          startMinutes < slot.endMinutes &&
          endMinutes > slot.startMinutes
      );
      return !overlapsBooked;
    })
    .map(minutesToHHmm);
};

const BookingForm = ({
  isOpen,
  onClose,
  onSave,
  locations,
  companies,
  presetValues = null,
  roomSlots = null,
  lockPresetFields = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    meetingRoom: "",
    companyId: "",
    customerId: "",
    startTime: "",
    endTime: "",
  });

  const [meetingRooms, setMeetingRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookedSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      title: "",
      description: "",
      date: presetValues?.date || "",
      location: presetValues?.location || "",
      meetingRoom: presetValues?.meetingRoom || "",
      companyId: "",
      customerId: "",
      startTime: presetValues?.startTime || "",
      endTime: presetValues?.endTime || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Fetch users when company changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!formData.companyId) {
        setUsers([]);
        return;
      }
      try {
        const usersRes = await getUsersByCompanyId(formData.companyId);
        setUsers(usersRes.data);
      } catch {
        setErrorMessage("Failed to fetch users.");
        setUsers([]);
      }
    };
    fetchUsers();
  }, [formData.companyId]);

  // Fetch meeting rooms when location changes
  useEffect(() => {
    const fetchMeetingRooms = async () => {
      if (!formData.location) {
        setMeetingRooms([]);
        return;
      }
      try {
        const res = await getRoomByLocationId(formData.location);
        setMeetingRooms(res.data);
      } catch {
        setErrorMessage("Failed to fetch meeting rooms.");
        setMeetingRooms([]);
      }
    };
    fetchMeetingRooms();
  }, [formData.location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "startTime") {
        next.endTime = "";
      }
      return next;
    });
  };

  const getDisabledTimes = () => {
    if (!formData.date || !formData.meetingRoom) return [];
    return bookedSlots
      .filter(
        (b) => b.date === formData.date && b.roomId === formData.meetingRoom
      )
      .map((b) => b.startTime);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      setErrorMessage("Please enter a title.");
      return;
    }
    if (!formData.location) {
      setErrorMessage("Please select a location.");
      return;
    }
    if (!formData.meetingRoom) {
      setErrorMessage("Please select a meeting room.");
      return;
    }
    if (!formData.companyId) {
      setErrorMessage("Please select a company.");
      return;
    }
    if (!formData.customerId) {
      setErrorMessage("Please select a member.");
      return;
    }
    if (!formData.date) {
      setErrorMessage("Please select a date.");
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      setErrorMessage("Please select both start and end times.");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: toDateTimeString(formData.date, formData.startTime),
      endTime: toDateTimeString(formData.date, formData.endTime),
      location_id: parseInt(formData.location),
      room_id: parseInt(formData.meetingRoom),
      company_id: parseInt(formData.companyId),
      user_id: parseInt(formData.customerId),
      status: "confirmed",
    };

    try {
      onSave(payload);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Failed to save booking.");
    }
  };

  const disabledTimes = getDisabledTimes();
  const isDateSelected = !!formData.date;
  const useRestrictedSlots = Boolean(roomSlots?.length);

  const availableStartTimes = useRestrictedSlots
    ? roomSlots
        .filter((slot) => !slot.isBooked)
        .filter((slot) => {
          if (formData.date !== getTodayDate()) return true;
          return slot.startMinutes >= getMinStartMinutesForDate(formData.date);
        })
        .map((slot) => minutesToHHmm(slot.startMinutes))
    : timeSlots.filter((time) => !disabledTimes.includes(time));

  const availableEndTimes = useRestrictedSlots
    ? getEndTimeOptions(formData.startTime, roomSlots)
    : timeSlots.filter((time) => !disabledTimes.includes(time));

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <form onSubmit={handleSubmit} className="location-form">
          <div style={{ marginBottom: "20px" }}>
            {/* Dropdowns Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <div style={{ flex: "1" }}>
                <label>Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  disabled={lockPresetFields}
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: "1" }}>
                <label>Meeting Room</label>
                <select
                  name="meetingRoom"
                  value={formData.meetingRoom}
                  onChange={handleChange}
                  required
                  disabled={lockPresetFields}
                >
                  <option value="">Select Room</option>
                  {meetingRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: "1" }}>
                <label>Company</label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: "1" }}>
                <label>Member</label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Member</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div
              style={{
                flex: "1",
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              <div>
                <label>
                  <strong>Select Date</strong>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={lockPresetFields}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "4px",
                  }}
                />
              </div>

              {isDateSelected && (
                <>
                  <div style={{ flex: "1" }}>
                    <label>Start Time</label>
                    <select
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Time</option>
                      {availableStartTimes.map((time) => (
                        <option key={time} value={time}>
                          {to12HourFormat(time)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: "1" }}>
                    <label>End Time</label>
                    <select
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      disabled={!formData.startTime}
                    >
                      <option value="">Select Time</option>
                      {availableEndTimes.map((time) => (
                        <option key={time} value={time}>
                          {to12HourFormat(time)}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Title */}
            <div style={{ marginBottom: "15px" }}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter booking title"
                required
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "15px" }}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter description..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  backgroundColor: "#f9f9f9",
                  fontSize: "14px",
                }}
              />
            </div>

          {/* Buttons */}
          <div
            className="button-group"
            style={{
              marginTop: "30px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <button
              type="submit"
              className="btn-proceed"
              disabled={!formData.date}
            >
              Proceed
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Error Popup */}
      <ErrorPopup message={errorMessage} onClose={() => setErrorMessage("")} />
    </>
  );
};

export default BookingForm;
