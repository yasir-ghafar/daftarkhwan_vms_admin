import "./locations.css";
import React, { useEffect, useState } from "react";
import LocationList from "./locations_list";
import { getLocations, addNewLocation, deleteLocation, updateLocation } from "../../api/locations_api";
import AddLocationModal from "./add_location_modal";

const Locations = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editLocation, setEditLocation] = useState(null); // 🆕

  const fetchLocations = async () => {
    try { 
      const data = await getLocations();
      setLocations(data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load locations.", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAddLocation = async (locationData) => {
    try {
      if (editLocation) {
        // TODO: add updateLocation API here if available
        setEditLocation(null);
        //const data = await updateLocation(editLocation);
        console.log(editLocation)
      } else {
        const data = await addNewLocation(locationData);
        setLocations((prev) => [...prev, data.data]); // assuming backend returns newly added location
      }
    } catch (error) {
      alert("Unable to save location");
    } finally {
      setModalOpen(false);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteLocation(id);
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    } catch (error) {
      alert("Error deleting location");
    }
  };

  const handleEditClick = (location) => {
    setEditLocation(location);
    setModalOpen(true);
  };

  return (
    <>
      <div className="top-bar">
        <h2>Locations</h2>
        <button className="add-btn" onClick={() => {
          setEditLocation(null);
          setModalOpen(true);
        }}>
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

      {error && <div className="error-popup"><p>{error}</p></div>}

      {!loading && !error && (
        <LocationList
          locations={locations}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick} // 🆕 Pass edit handler
        />
      )}

      <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddLocation}
        editData={editLocation} // 🆕
      />
    </>
  );
};


export default Locations;