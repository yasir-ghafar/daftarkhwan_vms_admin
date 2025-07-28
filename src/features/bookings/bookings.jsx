import React, { useEffect, useState } from "react";
import { getBookings } from "../../api/bookings";


const Bookings = () => {
    const [search, setSearch] = useState("");
    const [bookings, setBookings] = useState([]);


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
        </>
    );
};

export default Bookings;