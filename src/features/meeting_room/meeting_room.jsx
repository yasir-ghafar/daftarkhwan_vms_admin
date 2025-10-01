import React, { useEffect, useState } from "react";
import {
  getRooms,
  addNewRoom,
  updateRoom,
  deleteRoom,
  getAmenities,
} from "../../api/rooms_api";
import { getLocations } from "../../api/locations_api";
import RoomsList from "./room_list";
import AddRoomModal from "./add_meeting_room";
import DeleteDialog from "../../components/DeleteDialog";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../firebase/firebase";

const floors = [
  "Ground Floor",
  "1st Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
  "5th Floor",
  "6th Floor",
  "7th Floor",
  "8th Floor",
  "9th Floor",
];

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
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await getRooms();
      console.log(res.data);
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

      console.log(dataObject);

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

  const handleConfirmDelete = async (e) => {
    setIsDialogOpen(false);
    setLoading(true);
    try {
      console.log(`Deleting Item with id: ${selectedRoom.id}`);
      await deleteRoom(selectedRoom.id);
      setRooms((prev) => prev.filter((room) => room.id !== id));
    } catch (err) {
      alert("Error deleting Meeting Room:" + err);
    } finally {
      setLoading(false);
    }
    // TODO: Implement actual delete API call and update rooms
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
  };

  const filteredRooms = rooms.filter((room) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      room.name?.toLowerCase().includes(searchTerm) ||
      room.location?.name?.toLowerCase().includes(searchTerm) ||
      room.status?.toLowerCase().includes(searchTerm);

    const matchesLocation = selectedLocation
      ? String(room.LocationId) === String(selectedLocation)
      : true;

    const matchesFloor = selectedFloor ? room.floor === selectedFloor : true;

    return matchesSearch && matchesLocation && matchesFloor;
  });

  return (
    <div>
      <div className="top-bar">
        <h2>Meeting Rooms</h2>
        <button className="add-btn" onClick={openAddNewRoom}>
          Add New
        </button>
      </div>

      <div className="filters-bar">
        <input
        type="text"
        placeholder="Search meeting rooms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
        {/* Location Filter */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">All Locations</option>
          {[
            ...new Map(
              rooms.map((room) => [room.LocationId, room.location?.name])
            ),
          ].map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        {/* Floor Filter */}
        <select
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">All Floors</option>
          {floors.map((floor, idx) => (
            <option key={idx} value={floor}>
              {floor}
            </option>
          ))}
        </select>
      </div>

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
