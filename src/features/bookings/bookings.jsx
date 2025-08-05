import React, { useEffect, useState } from "react";
import { getBookings } from "../../api/bookings";
import { getLocations } from "../../api/locations_api";
import BookingForm from "./add_new_booking"; // update path if needed
import BookingsList from "./booking_list";

const Bookings = () => {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editBooking, setEditBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      console.log(data.data);
      setBookings(data.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
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
      setEditBooking(null);
      setModalOpen(true);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError("Failed to load locations.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditBooking = async (bookingData) => {
    try {
      if (editBooking) {
        console.log("Edit booking:", editBooking, bookingData);
        setEditBooking(null);
      } else {
        console.log("Add new booking:", bookingData);
      }
    } catch (error) {
      alert("Unable to save booking");
    } finally {
      setModalOpen(false);
    }
  };

  const handleEditClick = async (booking) => {
    try {
      const data = await getLocations();
      setLocations(data.data);
      setEditBooking(booking);
      setModalOpen(true);
    } catch (err) {
      console.error('Error loading locations for edit:', err);
      setError("Failed to load locations.");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      console.log("Delete booking:", id);
    } catch (error) {
      alert("Error deleting booking");
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

      {error && <div className="error-popup"><p>{error}</p></div>}

      {!loading && !error && (
        <BookingsList
        bookings={bookings}
        />
      )}


      
      {modalOpen && (
        <BookingForm
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditBooking(null);
          }}
          onSave={handleAddOrEditBooking}
          locations={locations}
          editData={editBooking}
        />
      )}
    </>
  );
};

export default Bookings;
