import "./locations.css";
import React, { useEffect, useState } from "react";
import LocationList from "./locations_list";
import { getLocations, addNewLocation, deleteLocation, updateLocation } from "../../api/locations_api";
import AddLocationModal from "./add_location_modal";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../firebase/firebase";

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

    setModalOpen(false);
    setLoading(true);

    try {
      const dataObject = {};
      for (let [key, value] of formData.entries()) {
        dataObject[key] = value;
      }

      const imageFile = formData.get("image");
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        try {
          const imageUrl = await uploadImageToFirebase(imageFile);
          dataObject.image = imageUrl;
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          alert("Image upload failed. Please try again.");
          return;
        }
      }

      if (isEditing) {
        dataObject.id = editLocation.id;
        await updateLocation(dataObject);
      } else {
        await addNewLocation(dataObject);
      }

      await fetchLocations();
      if (isEditing) setEditLocation(null);
    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
      alert("Unable to save location");
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToFirebase = async (imageFile) => {
    try {
      if (imageFile) {
        const storage = getStorage(app);
        const storageRef = ref(storage, "images/" + imageFile.name);
        await uploadBytes(storageRef, imageFile);
        return await getDownloadURL(storageRef);
      }
    } catch (imageUploadError) {
      console.log(imageUploadError);
      return null;
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

  // 🔍 Filter locations before sending to LocationList
  const filteredLocations = locations.filter((loc) => {
    const searchTerm = search.toLowerCase();
    return (
      loc.name?.toLowerCase().includes(searchTerm) ||
      loc.city?.toLowerCase().includes(searchTerm) ||
      loc.contactNumber?.toLowerCase().includes(searchTerm) ||
      loc.email?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <>
      <div className="top-bar">
        <h2>Locations</h2>
        <button
          className="add-btn"
          onClick={() => {
            setEditLocation(null);
            setModalOpen(true);
          }}
        >
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
            <p>Loading please wait....</p>
          </div>
        </div>
      )}

      {error && <div className="error-popup"><p>{error}</p></div>}

      {!loading && !error && (
        <LocationList
          locations={filteredLocations}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
          loading={loading}
          search={search} // 🔍 pass search term for page reset
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
