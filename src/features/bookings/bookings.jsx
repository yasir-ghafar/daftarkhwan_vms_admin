import React, { useEffect, useState } from "react";
import { addNewBooking, getBookings, cancelBooking } from "../../api/bookings";
import { getLocations } from "../../api/locations_api";
import { getCompanies } from "../../api/company_api";
import BookingForm from "./add_new_booking";
import BookingsList from "./booking_list";
import ErrorPopup from "../../components/error_popup";
import SuccessPopup from "../../components/confirmation_popup";
import "./bookings.css";

const PAGE_SIZE = 10;

const Bookings = () => {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const extractErrorMessage = (err) => {
    if (!err) return "An unknown error occurred.";
    if (typeof err === "string") return err;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
    return "An error occurred.";
  };

  const fetchBookings = async (page) => {
    setLoading(true);
    try {
      const response = await getBookings({ page, page_size: PAGE_SIZE });
      const payload = response?.data ?? {};

      setBookings(payload.bookings ?? []);
      setCurrentPage(page);
      setTotalPages(Math.max(1, Number(payload.total_pages) || 1));
      setTotalItems(Number(payload.total_items) || 0);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationsRes = await getLocations();
        setLocations(locationsRes.data || []);
      } catch {
        // Keep the page usable even if locations fail to load for the filter.
      }
    };

    loadLocations();
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
    } catch {
      setError("Failed to load locations and companies.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditBooking = async (newBooking) => {
    setLoading(true);
    try {
      const response = await addNewBooking(newBooking);
      if (response.status === 201) {
        setModalOpen(false);
        setSuccessMessage(response.data.message);
        if (currentPage !== 1) {
          setCurrentPage(1);
        } else {
          fetchBookings(1);
        }
      } else if (response.status === 403) {
        throw new Error("Insufficient wallet balance");
      } else {
        throw new Error("Booking failed.");
      }
    } catch (err) {
      if (err.status === 403) {
        setError("Insufficient wallet balance");
      } else if (err.status === 409) {
        setError(
          "The selected room is already booked during the requested time."
        );
      } else {
        setError(extractErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (id) => {
    setSelectedBookingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleProceedDelete = async () => {
    setLoading(true);
    try {
      await cancelBooking(selectedBookingId);

      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setSelectedBookingId(null);
    }
  };

  const normalize = (v) =>
    v === null || v === undefined ? "" : String(v).toLowerCase();
  const searchTerm = normalize(search).trim();

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = !searchTerm
      ? true
      : [
          booking.date,
          booking.Room?.name,
          booking.Room?.location?.name,
          booking.User?.name,
          booking.User?.Company?.name,
          booking.startTime,
          booking.endTime,
        ].some((field) => normalize(field).includes(searchTerm));

    const matchesLocation = selectedLocation
      ? String(booking.location_id) === String(selectedLocation)
      : true;

    return matchesSearch && matchesLocation;
  });

  const handlePageChange = (page) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);
    if (nextPage !== currentPage) {
      setCurrentPage(nextPage);
    }
  };

  return (
    <div className="bookings-page">
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

      <div className="filters-bar">
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-dialog">
            <div className="loader"></div>
            <p>Loading please wait....</p>
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

      <BookingsList
        bookings={filteredBookings}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        loading={loading}
        onPageChange={handlePageChange}
        onCancelClick={handleCancelClick}
      />

      {modalOpen && (
        <BookingForm
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleAddOrEditBooking}
          locations={locations}
          companies={companies}
        />
      )}

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Do you want to cancel this booking?</h3>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn-danger" onClick={handleProceedDelete}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
