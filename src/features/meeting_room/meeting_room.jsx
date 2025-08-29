import React, { useEffect, useState } from "react";
import { getRooms, addNewRoom, updateRoom, getAmenities } from "../../api/rooms_api";
import { getLocations } from "../../api/locations_api";
import RoomsList from "./room_list";
import AddRoomModal from "./add_meeting_room";
import DeleteDialog from "../../components/DeleteDialog";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../firebase/firebase";


const MeetingRooms = () => {
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amenities, setAmenities] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [deleteMesssage, setDeleteMessage] = useState("");
  const [editRoom, setEditRoom] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await getRooms();
      setRooms(res.data);
    } catch (err) {
      console.error("Error Fetching Meeting Rooms:", err);
      setError("Failed to load meeting rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (roomData) => {
    const isEditing = !!selectedRoom;
    setModalOpen(false);
    setLoading(true);

    try {
      const dataObject = {};
      for (let [key, value] of roomData.entries()) {
        dataObject[key] = value;
      }

      const imageFile = roomData.get("image");
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

      if (selectedRoom) {
        dataObject.id = selectedRoom.id;
        await updateRoom(dataObject);
      } else {
        await addNewRoom(dataObject);
      }

      await fetchRooms();
      if (selectedRoom) setSelectedRoom(null);

    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
      alert("Unable to save meeting room");
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

  const openAddNewRoom = async () => {
    setLoading(true);
    try {
      const [locationRes, amenitiesRes] = await Promise.all([
        getLocations(),
        getAmenities(),
      ]);
      setLocations(locationRes.data);
      setAmenities(amenitiesRes.data);
      setModalOpen(true);
    } catch (err) {
      console.error("Error opening modal:", err);
      setError("Failed to open modal.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (room) => {
    setSelectedRoom(room);
    setLoading(true);
    try {
      const locationRes = await getLocations();
      const matched = locationRes.data.find(
        (loc) => loc.id === room.location_id
      );
      setLocations(locationRes.data);
      setSelectedRoom({
        ...room,
        location: matched,
        locationId: matched?.id || "",
      });
      const amenitiesRes = await getAmenities();
      setAmenities(amenitiesRes.data);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching data for edit:", err);
      setError("Could not load room data for editing.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (room) => {
    setDeleteMessage(`Are you sure you want to delete? ${room.name}`);
    setSelectedRoom(room);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = (e) => {
    setIsDialogOpen(false);
    console.log(`Deleting Item with id: ${selectedRoom.id}`);
    // TODO: Implement actual delete API call and update rooms
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
  };

  // 🔍 Filter rooms before sending to list
  const filteredRooms = rooms.filter((room) => {
    const searchTerm = search.toLowerCase();
    return (
      room.name?.toLowerCase().includes(searchTerm) ||
      room.location?.name?.toLowerCase().includes(searchTerm) ||
      room.Status?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div>
      <div className="top-bar">
        <h2>Meeting Rooms</h2>
        <button className="add-btn" onClick={openAddNewRoom}>
          Add New
        </button>
      </div>

      <input
        type="text"
        placeholder="Search meeting rooms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {error && (
        <div className="error-popup">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-dialog">
            <div className="loader"></div>
            <p>Loading please wait...</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <RoomsList
          rooms={filteredRooms}
          onDelete={handleDelete}
          onEdit={handleEdit}
          search={search} // Pass search term for page reset
        />
      )}

      <DeleteDialog
        isOpen={isDialogOpen}
        message={deleteMesssage}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <AddRoomModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedRoom(null);
        }}
        onSave={handleAddRoom}
        locations={locations}
        amenities={amenities}
        selectedRoom={selectedRoom}
        isEdit={!!selectedRoom}
      />
    </div>
  );
};

export default MeetingRooms;
