import React, { useEffect, useState } from "react";
import { getLocations } from "../../api/locations_api";
import { getRooms } from "../../api/rooms_api";
import { getBookingsByRoomAndDate, addNewBooking } from "../../api/bookings";
import { getCompanies } from "../../api/company_api";
import BookingForm from "../bookings/add_new_booking";
import ErrorPopup from "../../components/error_popup";
import SuccessPopup from "../../components/confirmation_popup";

const SLOT_INTERVAL_MINUTES = 30;
const DEFAULT_OPENING_MINUTES = 9 * 60;
const DEFAULT_CLOSING_MINUTES = 21 * 60 + 30;

const fieldClassName =
  "h-10 w-full min-w-[220px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue disabled:bg-gray-100 disabled:cursor-not-allowed";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getRoomLocationId = (room) => room.location_id ?? room.LocationId;

const minutesToHHmm = (minutes) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;

  let str = String(timeStr).trim();
  const dateTimeMatch = str.match(/^\d{4}-\d{2}-\d{2}\s+(.+)$/);
  if (dateTimeMatch) str = dateTimeMatch[1];

  const match = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ampm = match[4]?.toUpperCase();

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
};

const formatMinutesTo12Hour = (minutes) => {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const hour12 = hour24 % 12 || 12;
  const ampm = hour24 >= 12 ? "PM" : "AM";
  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm}`;
};

const formatTimeTo12Hour = (timeStr, fallbackMinutes) => {
  const minutes = parseTimeToMinutes(timeStr);
  if (minutes !== null) return formatMinutesTo12Hour(minutes);
  return formatMinutesTo12Hour(fallbackMinutes);
};

const generateTimeSlots = (openingMinutes, closingMinutes) => {
  const slots = [];

  for (
    let start = openingMinutes;
    start + SLOT_INTERVAL_MINUTES <= closingMinutes;
    start += SLOT_INTERVAL_MINUTES
  ) {
    const end = start + SLOT_INTERVAL_MINUTES;
    slots.push({
      startMinutes: start,
      endMinutes: end,
      label: `${formatMinutesTo12Hour(start)} - ${formatMinutesTo12Hour(end)}`,
    });
  }

  return slots;
};

const normalizeBookings = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

const isSlotBooked = (slot, bookings) => {
  if (!bookings.length) return false;

  return bookings.some((booking) => {
    const bookingStart = parseTimeToMinutes(booking.startTime);
    const bookingEnd = parseTimeToMinutes(booking.endTime);

    if (bookingStart === null || bookingEnd === null) return false;

    return bookingStart < slot.endMinutes && bookingEnd > slot.startMinutes;
  });
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

const isSlotBookable = (slot, date) => {
  if (slot.isBooked) return false;
  if (date !== getTodayDate()) return true;
  return slot.startMinutes >= getMinStartMinutesForDate(date);
};

const extractErrorMessage = (err) => {
  if (!err) return "An unknown error occurred.";
  if (typeof err === "string") return err;
  if (err.response?.data?.message) return err.response.data.message;
  if (err.message) return err.message;
  return "An error occurred.";
};

const MeetingRoomStatus = () => {
  const [locations, setLocations] = useState([]);
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedMeetingRoom, setSelectedMeetingRoom] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [slots, setSlots] = useState([]);
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPreset, setBookingPreset] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [locationsRes, roomsRes] = await Promise.all([
          getLocations(),
          getRooms(),
        ]);

        setLocations(locationsRes.data ?? []);
        setMeetingRooms(roomsRes.data ?? []);
      } catch {
        setError("Failed to load locations and meeting rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMeetingRooms = selectedLocation
    ? meetingRooms.filter(
        (room) => String(getRoomLocationId(room)) === String(selectedLocation)
      )
    : meetingRooms;

  const selectedRoom = meetingRooms.find(
    (room) => String(room.id) === String(selectedMeetingRoom)
  );

  const resetStatus = () => {
    setSlots([]);
    setHasCheckedStatus(false);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setSelectedMeetingRoom("");
    resetStatus();
  };

  const handleMeetingRoomChange = (e) => {
    setSelectedMeetingRoom(e.target.value);
    resetStatus();
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    resetStatus();
  };

  const buildSlotsWithStatus = (bookings) => {
    const openingMinutes =
      parseTimeToMinutes(selectedRoom?.openingTime) ?? DEFAULT_OPENING_MINUTES;
    const closingMinutes =
      parseTimeToMinutes(selectedRoom?.closingTime) ?? DEFAULT_CLOSING_MINUTES;

    if (closingMinutes <= openingMinutes) {
      setError("Invalid opening or closing time for this meeting room.");
      return false;
    }

    const timeSlots = generateTimeSlots(openingMinutes, closingMinutes);
    setSlots(
      timeSlots.map((slot) => ({
        ...slot,
        isBooked: isSlotBooked(slot, bookings),
      }))
    );
    setHasCheckedStatus(true);
    return true;
  };

  const fetchRoomStatus = async () => {
    const response = await getBookingsByRoomAndDate(
      selectedMeetingRoom,
      selectedDate
    );
    return normalizeBookings(response);
  };

  const handleCheckStatus = async () => {
    if (!selectedMeetingRoom || !selectedDate) {
      setError("Please select a meeting room and date.");
      return;
    }

    setCheckingStatus(true);
    setError(null);
    resetStatus();

    try {
      const bookings = await fetchRoomStatus();
      buildSlotsWithStatus(bookings);
    } catch (err) {
      if (err.response?.status === 404) {
        buildSlotsWithStatus([]);
      } else {
        setError("Failed to fetch meeting room status.");
      }
    } finally {
      setCheckingStatus(false);
    }
  };

  const refreshStatus = async () => {
    if (!selectedMeetingRoom || !selectedDate) return;

    try {
      const bookings = await fetchRoomStatus();
      buildSlotsWithStatus(bookings);
    } catch (err) {
      if (err.response?.status === 404) {
        buildSlotsWithStatus([]);
      }
    }
  };

  const openBookingDialog = async (preset = {}) => {
    setSubmittingBooking(true);
    try {
      if (!companies.length) {
        const companiesRes = await getCompanies();
        setCompanies(companiesRes.data ?? []);
      }

      setBookingPreset({
        location: selectedLocation,
        meetingRoom: selectedMeetingRoom,
        date: selectedDate,
        startTime: preset.startTime || "",
        endTime: preset.endTime || "",
      });
      setBookingModalOpen(true);
    } catch {
      setError("Failed to load companies.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleFreeSlotClick = (slot) => {
    if (!isSlotBookable(slot, selectedDate)) {
      setError("This slot is no longer available for booking.");
      return;
    }

    openBookingDialog({
      startTime: minutesToHHmm(slot.startMinutes),
      endTime: minutesToHHmm(slot.endMinutes),
    });
  };

  const closeBookingDialog = () => {
    setBookingModalOpen(false);
    setBookingPreset(null);
  };

  const handleAddBooking = async (newBooking) => {
    setSubmittingBooking(true);
    try {
      const response = await addNewBooking(newBooking);
      if (response.status === 201) {
        closeBookingDialog();
        setSuccessMessage(response.data.message);
        await refreshStatus();
      } else if (response.status === 403) {
        throw new Error("Insufficient wallet balance");
      } else {
        throw new Error("Booking failed.");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Insufficient wallet balance");
      } else if (err.response?.status === 409) {
        setError(
          "The selected room is already booked during the requested time."
        );
      } else {
        setError(extractErrorMessage(err));
      }
    } finally {
      setSubmittingBooking(false);
    }
  };

  const canCheckStatus = Boolean(selectedMeetingRoom && selectedDate);
  const freeSlotsCount = slots.filter((slot) =>
    isSlotBookable(slot, selectedDate)
  ).length;
  const bookableSlotsCount = freeSlotsCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-brand-dark">
          Meeting Room Status
        </h2>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="text-sm font-semibold text-gray-700">
            Location
          </label>
          <select
            id="location"
            value={selectedLocation}
            onChange={handleLocationChange}
            className={fieldClassName}
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="meetingRoom" className="text-sm font-semibold text-gray-700">
            Meeting Room
          </label>
          <select
            id="meetingRoom"
            value={selectedMeetingRoom}
            onChange={handleMeetingRoomChange}
            className={fieldClassName}
            disabled={!selectedLocation}
          >
            <option value="">Select Meeting Room</option>
            {filteredMeetingRooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className="text-sm font-semibold text-gray-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className={fieldClassName}
          />
        </div>

        <button
          type="button"
          onClick={handleCheckStatus}
          disabled={!canCheckStatus || checkingStatus}
          className="h-10 shrink-0 rounded-md bg-brand-cta px-5 text-sm font-medium text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {checkingStatus ? "Checking..." : "Check Status"}
        </button>
      </div>

      {hasCheckedStatus && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-800">
              <span className="h-3.5 w-3.5 rounded border border-green-600 bg-green-100" />
              Free Slot
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-800">
              <span className="h-3.5 w-3.5 rounded border border-red-600 bg-red-100" />
              Booked Slot
            </span>
          </div>

          {selectedRoom && (
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                Operating hours:{" "}
                {formatTimeTo12Hour(
                  selectedRoom.openingTime,
                  DEFAULT_OPENING_MINUTES
                )}{" "}
                –{" "}
                {formatTimeTo12Hour(
                  selectedRoom.closingTime,
                  DEFAULT_CLOSING_MINUTES
                )}
              </p>
              <p>
                Available slots:{" "}
                <span className="font-semibold text-green-700">
                  {freeSlotsCount}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Click an Available slot to create a booking.
              </p>
            </div>
          )}

          {slots.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
              {slots.map((slot) => {
                const bookable = isSlotBookable(slot, selectedDate);

                return (
                  <button
                    key={slot.label}
                    type="button"
                    onClick={() => bookable && handleFreeSlotClick(slot)}
                    disabled={!bookable}
                    className={`flex flex-col gap-1 rounded-lg border px-3 py-3 text-left transition ${
                      slot.isBooked
                        ? "cursor-not-allowed border-red-500 bg-red-100 text-red-900"
                        : bookable
                          ? "cursor-pointer border-green-500 bg-green-100 text-green-900 hover:bg-green-200 hover:shadow-sm"
                          : "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500"
                    }`}
                  >
                    <span className="text-sm font-semibold">{slot.label}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {slot.isBooked
                        ? "Booked"
                        : bookable
                          ? "Free"
                          : "Past"}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm italic text-gray-500">
              No slots available for this meeting room.
            </p>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => openBookingDialog()}
              disabled={!bookableSlotsCount || submittingBooking}
              className="h-10 rounded-md bg-brand-cta px-5 text-sm font-medium text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Make a Booking
            </button>
          </div>
        </div>
      )}

      {bookingModalOpen && bookingPreset && (
        <BookingForm
          isOpen={bookingModalOpen}
          onClose={closeBookingDialog}
          onSave={handleAddBooking}
          locations={locations}
          companies={companies}
          presetValues={bookingPreset}
          roomSlots={slots}
          lockPresetFields
        />
      )}

      {(loading || checkingStatus || submittingBooking) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="loader mb-2" />
            <p className="font-medium text-brand-dark">Loading please wait...</p>
          </div>
        </div>
      )}

      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
};

export default MeetingRoomStatus;
