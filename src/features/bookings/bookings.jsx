import React, { useEffect, useState } from "react";
import { addNewBooking, getBookings } from "../../api/bookings";
import { getLocations } from "../../api/locations_api";
import { getCompanies } from "../../api/company_api";
import BookingForm from "./add_new_booking";
import BookingsList from "./booking_list";
import ErrorPopup from "../../components/error_popup";

const Bookings = () => {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utility to convert error to string
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
    setLoading(true);
    try {
      const response = await addNewBooking(newBooking);
      if (response.status === 200) {
        setModalOpen(false);
        fetchBookings(); // reload list
      } else {
        throw new Error("Booking failed.");
      }
    } catch (err) {
      console.error(err);
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="top-bar">
        <h2>Bookings</h2>
        <button className="add-btn" onClick={openAddNewBooking}>Add New</button>
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

      {!loading && !error && (
        <BookingsList bookings={bookings} />
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
    </>
  );
};

export default Bookings;
