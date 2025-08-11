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

  setModalOpen(false);  // Close the modal immediately
  setLoading(true);     // Show loading overlay

  try {
    // Step 1: Convert formData into a plain object
    const dataObject = {};
    for (let [key, value] of formData.entries()) {
      dataObject[key] = value;
    }

    // Step 2: If an image file exists, upload it to Firebase
    const imageFile = formData.get("image"); // Assuming "image" is the field name in your form
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      try {
        const imageUrl = await uploadImageToFirebase(imageFile); // <--- Your helper function
        dataObject.image = imageUrl; // Replace the file with the Firebase URL
      } catch (uploadErr) {
        console.error("Image upload failed:", uploadErr);
        alert("Image upload failed. Please try again.");
        return; // Stop the process if upload fails
      }
    }

    // Step 3: If editing, include the ID and update, else create new
    if (isEditing) {
      dataObject.id = editLocation.id;
      await updateLocation(dataObject);
    } else {
      await addNewLocation(dataObject);
    }

    // Step 4: Refresh list after operation
    await fetchLocations();

    // Step 5: Clear edit state if editing
    if (isEditing) setEditLocation(null);

  } catch (err) {
    console.error("Save failed:", err.response?.data || err.message);
    alert("Unable to save location");
  } finally {
    setLoading(false); // Hide loading overlay
  }
};

const uploadImageToFirebase = async (imageFile) => {
  try{
  if (imageFile) {
    const storage=getStorage(app);
    const storageRef = ref(storage, "images/"+imageFile.name);
    await uploadBytes(storageRef, imageFile);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
   }
  } catch(imageUploadError) {
    console.log(imageUploadError)
    return null;
  } 
}



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
