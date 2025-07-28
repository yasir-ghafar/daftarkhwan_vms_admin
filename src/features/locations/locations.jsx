import "./locations.css";
import React, { useEffect, useState } from "react";
import LocationList from "./locations_list";
import { getLocations, addNewLocation, deleteLocation } from "../../api/locations_api";
import AddLocationModal from "./add_location_modal";

const Locations = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  const handleAddLocation = async (newLocation) => {
    console.log(newLocation);
    try {
      const data = await addNewLocation(newLocation);
      console.log(data);
    } catch (error) {
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
        setError("Failed to load locations."); // Set error message
        setLoading(false);
      });
  }, []);


  const handleDelteClick = async (id) => {
    try {
      
      await deleteLocation(id)
      .then((response) =>{
        console.log(response);
        setLocations((locations) => locations.filter((loc) => loc.id !==id));
      });
    } catch(error) {
      console.error("Failed to delete location:", error);
      alert("Error deleting location");
    }
  }

  return (
    <>
      <div className="top-bar">
        <h2>Locations</h2>
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

      {loading && (
        <div className="loading-overlay">
          
          <div className="loading-dialog">
            <div className="loader"></div>
            <p> Loading please wait....</p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-popup">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <LocationList locations={locations} onDelete={handleDelteClick} />
      )}

      <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddLocation}
      />
    </>
  );
};

export default Locations;