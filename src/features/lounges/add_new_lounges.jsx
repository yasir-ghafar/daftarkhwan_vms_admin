import React, { useState, useEffect, useRef } from "react";
import { getUsersByCompanyId } from "../../api/authApi";
import ErrorPopup from "../../components/error_popup";
import SuccessPopup from "../../components/confirmation_popup";
import Select from "react-select";

const floors = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor", "6th Floor", "7th Floor", "8th Floor", "9th Floor"];
const weekdays = [{abbrev: "Mon", name: "Monday"}, {abbrev: "Tue", name: "Tuesday"}, {abbrev: "Wed", name: "Wednesday"}, {abbrev: "Thur", name: "Thursday"}, {abbrev: "Fri", name: "Friday"}, {abbrev: "Sat", name: "Saturday"}, {abbrev: "Sun", name: "Sunday"}];

function toStringArray(input) {
  if (!input) return [];

  let value = input;

  try {
    // Keep parsing until we stop getting a string
    while (typeof value === "string") {
      value = JSON.parse(value);
    }
  } catch (e) {
    console.error("Failed to parse string array:", e);
    return [];
  }

  return Array.isArray(value) ? value.map(String) : [];
}

// Map available days to UI abbreviations
function mapAvailableDays(input, weekdays) {
  return toStringArray(input).map((day) => {
    const found = weekdays.find((w) => w.name === day || w.abbrev === day);
    return found ? found.abbrev : day;
  });
}

// Normalize amenities to plain string array
function mapAmenities(input) {
  return toStringArray(input).map((a) =>
    typeof a === "string" ? a : a?.name
  ).filter(Boolean);
}


// Convert 24-hour to 12-hour format with seconds and AM/PM
const to12HourFormat = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${minute}:00 ${ampm}`;
};

// Backwards-compatible alias used by other modules
const formatTimeToAMPM = (time24) => to12HourFormat(time24);

// Convert date + time to full string
const toDateTimeString = (date, time) => {
  if (!date || !time) return "";
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");
  return `${year}-${month}-${day} ${hour}:${minute}:00`;
};


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

const getEndTimeOptions = (OpeningTime, roomSlots) => {
  if (!OpeningTime || !roomSlots?.length) return [];

  const startMinutes = hhmmToMinutes(OpeningTime);

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


const LoungesForm = ({
  isOpen,
  onClose,
  onSave,
  locations,
  selectedlounges, 
  amenities,
  lockPresetFields = false,
 }) => {

  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef();

  const defaultFormState = {
        name: "",
        creditsPerSlot: "",
        capacity: "",
        location: "",
        floor: "",
        availableDays: [],
        status: "active",
        amenities: [],
        openingTime: "",
        closingTime: "",
        image: null,
    };

    const [form, setForm] = useState(defaultFormState);
    
      useEffect(() => {
      if (selectedlounges) {
        //const mappedDays = mapAvailableDays(selectedlounges.availableDays, weekdays);
        const mappedAmenities = mapAmenities(selectedlounges.amenities);
    
        setForm({
          ...defaultFormState,
          //name: selectedlounges.name || "",
          location: selectedlounges.location || selectedlounges.location || selectedlounges.location?.id || "",
          creditsPerSlot: selectedlounges.creditsPerSlot?.toString() || "",
          capacity: selectedlounges.capacity?.toString() || "",
          //floor: selectedlounges.floor?.toString() || "",
          openingTime: selectedlounges.openingTime || "",
          closingTime: selectedlounges.closingTime || "",
          //status: selectedlounges.status || "active",
          availableDays: mapAvailableDays(selectedlounges.availableDays, weekdays),
          amenities: mappedAmenities,
        });
        console.log("Selected Lounges:", selectedlounges.name);
        console.log("floor:", selectedlounges.floor);
        console.log("status:", selectedlounges.status);
        setImagePreview(selectedlounges.image || null);
      } else {
        setForm(defaultFormState);
        setImagePreview(null);
        setImage(null);
      }
    }, [selectedlounges]);
    
      if (!isOpen) return null;
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const next = { ...prev, [name]: value };
            if (name === "OpeningTime") {
                next.ClosingTime = "";
            }
            return next;
        });
    };
    
      const handleDayToggle = (dayAbbrev) => {
        setForm((prev) => {
          const current = Array.isArray(prev.availableDays) ? prev.availableDays : [];
          return {
            ...prev,
            availableDays: current.includes(dayAbbrev)
              ? current.filter((d) => d !== dayAbbrev)
              : [...current, dayAbbrev],
          };
        });
      };
    
      const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImage(file);
          setImagePreview(URL.createObjectURL(file));
        }
      };
    
      const removeImage = () => {
        setForm((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
      };
    
    const handleSubmit = (e) => {
      e.preventDefault();
    
      // Convert abbrev → full day names
      const availableDaysFull = form.availableDays.map(
        (abbrev) => weekdays.find((d) => d.abbrev === abbrev)?.name || abbrev
      );
    
      // Always ensure array
      const amenitiesArray = Array.isArray(form.amenities)
        ? form.amenities
        : [form.amenities];
    
    
      const formObject = {
        name: form.name,
        creditsPerSlot: form.creditsPerSlot,
        capacity: form.capacity,
        openingTime: formatTimeToAMPM(form.openingTime),
        closingTime: formatTimeToAMPM(form.closingTime),
        floor: form.floor,
        availableDays: availableDaysFull, // <-- stays array
        location: form.location,
        status: form.status,
        amenities: amenitiesArray, // <-- stays array
      };
    
      console.log("🚀 Clean Object:", formObject);


    
      // ✅ Build FormData for upload
      const formData = new FormData();
    
      Object.entries(formObject).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Convert arrays into JSON strings for FormData
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
    
      // Append image if uploaded
      if (image) {
        formData.append("image", image);
      } else if (selectedlounges?.imageUrl) {
        formData.append("imageUrl", selectedlounges.imageUrl);
      }
    
      if (onSave) onSave(formData);
    
      setSuccessMessage(
        selectedlounges ? "lounges updated successfully!" : "lounge created successfully!"
      );
    };
    
    return(
        <>
            <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black/50 overflow-hidden">
                <form onSubmit={handleSubmit} className="location-form w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg overflow-hidden">
                    <h3 style={{ marginBottom: "8px", color: "#2c3e50", width: "100%" }} className="text-xl font-bold">
                        {selectedlounges ? "Edit Meeting Room" : "Create Meeting Room"}
                    </h3>

                    {/* Room Info */}
                    <div className="flex flex-wrap justify-between gap-4 mb-2">
                        <div className="flex flex-col space-y-2 w-full md:w-[32%]">
                            <div className="flex-1 min-w-64">
                                <label>Room Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name ?? ""}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 w-full md:w-[32%]">
                        <div className="flex-1 min-w-64">
                            <label>Location:</label>
                                <select
                                    name="location"
                                    value={form.location ?? ""}
                                    onChange={handleChange}
                                    required
                                >
                            <option value="">Select Location</option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </option>
                            ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 w-full md:w-[32%]">
                        <div className="flex-1 min-w-64">
                            <label>Floor:</label>
                                <select
                                    name="floor"
                                    value={form.floor ?? ""}
                                    onChange={handleChange}
                                    required
                                >
                            <option value="">Select Floor</option>
                            {floors.map((f) => (
                                <option key={f} value={f}>
                                    {f}
                                </option>
                            ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Slot & Pricing Info */}
                <div className="flex flex-wrap justify-between gap-4 mb-2">
                    <div className="flex flex-col space-y-2 w-full md:w-[32%]">
                        <div className="flex-1 min-w-64">
                            <label>Credits/Slot:</label>
                            <input
                                type="number"
                                step="any"
                                name="creditsPerSlot"
                                value={form.creditsPerSlot ?? ""}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 w-full md:w-[32%]">
                        <div className="flex-1 min-w-64">
                            <label>capacity:</label>
                            <input
                                type="number"
                                name="capacity"
                                value={form.capacity ?? ""}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Timing and Status */}
                <div className="flex flex-wrap justify-between gap-1 mb-2">
                    <div className="flex flex-col space-y-2 w-full md:w-[32%]">
                        <div className="flex-1 min-w-64">
                            <label>Opening Time:</label>
                            <input
                                type="time"
                                name="openingTime"
                                value={form.openingTime ?? ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 w-full md:w-[32%]">
                        <div className="flex-1 min-w-64">
                            <label>Closing Time:</label>
                            <input
                                type="time"
                                name="closingTime"
                                value={form.closingTime ?? ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 w-full md:w-[32%]">
                        <div className="flex-1 min-w-64">
                            <label>Status:</label>
                            <select
                                name="status"
                                value={form.status ?? ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Amenities and Image */}
                <div className="flex flex-wrap justify-between gap-4 mb-2">
                    <div className="flex flex-col space-y-2 w-full md:w-[32%]">
                        <div className="flex-1 min-w-64 flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Amenities:
                            </label>
                            
                            <Select
                                options={amenities.map((amenity) => ({
                                    value: amenity.name,
                                    label: amenity.name,
                                }))}
                                isMulti
                                name="amenities"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={amenities
                                    .filter((a) => form.amenities.includes(a.name))
                                    .map((a) => ({ value: a.name, label: a.name }))}
                                onChange={(selectedOptions) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        amenities: selectedOptions.map((a) => a.value),
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 w-full md:w-[32%]">
                        <div className="flex-1 min-w-64">
                            <label>Upload Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                // required={!selectedlounges}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 w-full md:w-[32%]">
                        <div className="flex-1 min-w-64">
                            {imagePreview && (
                            <div className="image-preview-wrapper">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="px-1 py-1 bg-gray-200 text-white border-none rounded-sm text-base cursor-pointer transition-colors duration-200 ease-in"
                                />
                                <button
                                    type="button"
                                    className="px-4 py-2.5 border-none rounded-[20px] cursor-pointer font-bold"
                                    onClick={removeImage}
                                    >
                                    &times;
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Available Days */}
                <div className="flex flex-wrap justify-between gap-4 mb-2">
                    <div className="flex flex-col space-y-2 w-full md:w-[50%] full-width">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-700">Available Days:</label>
                            <div className="flex flex-wrap gap-2">
                                {weekdays.map((day) => (
                                    <div
                                        key={day.abbrev}
                                        className={`flex items-center justify-center px-3 py-1.5 border rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 select-none ${
                                            form.availableDays.includes(day.abbrev)
                                                ? "bg-[#3366ff] text-white border-[#3366ff]"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                        }`}
                                        onClick={() => handleDayToggle(day.abbrev)}
                                    >
                                        {day.abbrev}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-between gap-4 mb-2">
                    <div className="flex justify-end gap-2.5 mt-1">
                        <button type="button" onClick={onClose} className="py-2.5 px-4 border-none rounded-full cursor-pointer font-bold">
                            Cancel
                        </button>
                        <button type="submit" className="py-2.5 px-4 border-none rounded-full cursor-pointer font-bold">
                            Save
                        </button>
                    </div>
                </div>
                </form>
            </div>

            {successMessage && (
                <SuccessPopup
                message={successMessage}
                onClose={() => setSuccessMessage("")}
                />
            )}
        </>
    );
};

export default LoungesForm;
