import React, { useEffect, useState } from "react";
import { getBookings } from "../../api/bookings";
import { getLocations } from "../../api/locations_api";
import BookingForm from "./add_new_booking";
import BookingsList from "./booking_list";

const Bookings = () => {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const data = await getLocations();
      setLocations(data.data);
      setModalOpen(true);
    } catch {
      setError("Failed to load locations.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditBooking = (newBooking) => {
    setBookings(prev => [...prev, newBooking]); // add to frontend list
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

      {error && <div className="error-popup"><p>{error}</p></div>}

      {!loading && !error && (
        <BookingsList bookings={bookings} />
      )}
      {modalOpen && (
        <BookingForm
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleAddOrEditBooking}
          locations={locations}
        />
      )}
    </>
  );
};

export default Bookings;
