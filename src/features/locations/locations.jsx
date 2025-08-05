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
  const [editLocation, setEditLocation] = useState(null);

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

const handleAddLocation = async (formData) => {
  try {
    if (editLocation) {
      // Convert FormData to plain JS object
      const updatedData = {};
      for (let [key, value] of formData.entries()) {
        updatedData[key] = value;
      }
      updatedData.id = editLocation.id;

      const updated = await updateLocation(updatedData);

      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === updated.id ? updated : loc
        )
      );
      setEditLocation(null);
    } else {
      const data = await addNewLocation(formData); // use FormData for adding
      setLocations((prev) => [...prev, data.data]);
    }
  } catch (err) {
    console.error("Update failed:", err.response?.data || err.message);
    alert("Unable to save location");
  } finally {
    setModalOpen(false);
  }
};

  const handleDeleteClick = async (id) => {
    try {
      await deleteLocation(id);
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    } catch (err) {
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
          onEdit={handleEditClick}
        />
      )}

      <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddLocation}
        editData={editLocation}
      />
    </>
  );
};

export default Locations;