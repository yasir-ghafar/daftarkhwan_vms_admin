import React, { useEffect, useState } from "react";
import { addNewBooking, getBookings, cancelBooking } from "../../api/bookings";
import { getLocations } from "../../api/locations_api";
import { getCompanies } from "../../api/company_api";
import BookingForm from "./add_new_booking";
import BookingsList from "./booking_list";
import ErrorPopup from "../../components/error_popup";
import "./bookings.css";
import SuccessPopup from "../../components/confirmation_popup";

const Bookings = () => {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // new state for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const extractErrorMessage = (err) => {
    if (!err) return "An unknown error occurred.";
    if (typeof err === "string") return err;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
    return "An error occurred.";
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      console.log(data.data);
      setBookings(data.data);
    } catch (err) {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openAddNewBooking = async () => {
    setLoading(true);
    try {
      const [locationsRes, companiesRes] = await Promise.all([
        getLocations(),
        getCompanies(),
      ]);

      setLocations(locationsRes.data);
      setCompanies(companiesRes.data);
      setModalOpen(true);
    } catch (err) {
      setError("Failed to load locations and companies.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditBooking = async (newBooking) => {
    console.log(newBooking);
    setLoading(true);
    try {
      const response = await addNewBooking(newBooking);
      if (response.status === 201) {
        setModalOpen(false);
        setSuccessMessage(response.data.message);
        fetchBookings();
      } else if (response.status === 403) {
        throw new Error("Insufficient wallet balance");
      } else {
        throw new Error("Booking failed.");
      }
    } catch (err) {
      if (err.status === 403) {
        setError(extractErrorMessage("Insufficient wallet balance"));
      } else if (err.status === 409) {
        setError(extractErrorMessage("The selected room is already booked during the requested time."));
      } else {
        setError(extractErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // open delete confirmation modal
  const handleCancelClick = (id) => {
    setSelectedBookingId(id);
    setIsDeleteModalOpen(true);
  };

  // delete booking
  const handleProceedDelete = async () => {
    setLoading(true);
    try {
      await cancelBooking(selectedBookingId);
      setBookings((prev) => prev.filter((b) => b.id !== selectedBookingId));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setSelectedBookingId(null);
    }
  };

  return (
    <>
      <div className="top-bar">
        <h2>Bookings</h2>
        <button className="add-btn" onClick={openAddNewBooking}>
          Add New
        </button>
      </div>

      <input
        type="text"
        placeholder="Search bookings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading && (
        <div className="loading-overlay">
          <div className="loading-dialog">
            <div className="loader"></div>
            <p>Loading please wait....</p>
          </div>
        </div>
      )}

      {error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}

      {error && (
        <SuccessPopup message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}

      {!loading && !error && (
        <BookingsList bookings={bookings} search={search} onCancelClick={handleCancelClick} />
      )}

      {modalOpen && (
        <BookingForm
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleAddOrEditBooking}
          locations={locations}
          companies={companies}
        />
      )}

      {/* delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Do you want to cancel this booking?</h3>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleProceedDelete}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bookings;