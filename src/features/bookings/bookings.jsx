import React, { useEffect, useState } from "react";
import { getBookings } from "../../api/bookings";
import BookingForm from "./add_new_booking"; // update path if needed


const Bookings = () => {
    const [search, setSearch] = useState("");
    const [bookings, setBookings] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        getBookings()
            .then((data) => {
                console.log(data.data);
            })
    }, [])


    return (
        <>
            <div className="top-bar">
        <h2>Bookings</h2>
        <button className="add-btn" onClick={() => setModalOpen(true)}>
          Add New
        </button>
      </div>

      <input
        type="text"
        placeholder="Search locations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      {modalOpen && (
        <BookingForm
          isOpen={modalOpen}
          inClose={() => setModalOpen(false)}
          onSave={(data) => {
            console.log("Saved booking:", data);
            setModalOpen(false);
          }}
        />
      )}
        </>
    );
};

export default Bookings;