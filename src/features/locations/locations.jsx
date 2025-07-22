import React, { useEffect, useState } from "react";
import LocationList from "./locations_list";
import { getLocations, addNewLocation } from "../../api/locations_api";
import AddLocationModal from "./add_location_modal";

const Locations = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddLocation =  async (newLocation) => {
    try {
        const data = await addNewLocation(newLocation);
        console.log(data);
    } catch(error) {
        alert("Unable to create Location");
    }
  };


  useEffect(() => {
      getLocations()
        .then((data) => {
          console.log(data.data);
          setLocations(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching locations:", err);
          setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading....</p>;

    return (
      <>
      <div className="top-bar">
          <h2>Locations</h2>
          <button className="add-btn" onClick={() => setModalOpen(true)}>Add New</button>
        </div>

        <input
          type="text"
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <LocationList locations = {locations} />
        
        <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddLocation}
        />
      </>
    )
}

export default Locations;