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
  const isEditing = !!editLocation;

  setModalOpen(false);  // Close the modal immediately
  setLoading(true);     // Show loading overlay

  try {
    if (isEditing) {
      const updatedData = {};
      for (let [key, value] of formData.entries()) {
        updatedData[key] = value;
      }
      updatedData.id = editLocation.id;

      await updateLocation(updatedData);
      await fetchLocations(); // <--- ✅ Re-fetch fresh list
      setEditLocation(null);
    } else {
      await addNewLocation(formData);
      await fetchLocations(); // <--- ✅ Re-fetch fresh list
    }
  } catch (err) {
    console.error("Update failed:", err.response?.data || err.message);
    alert("Unable to save location");
  } finally {
    setLoading(false); // Hide loading overlay
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
          loading={loading}
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
