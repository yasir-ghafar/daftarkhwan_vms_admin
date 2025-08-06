import React, { useEffect, useState } from "react";
import { getRooms, addNewRoom, updateRoom, getAmenities } from "../../api/rooms_api";
import { getLocations } from "../../api/locations_api";
import RoomsList from "./room_list";
import AddRoomModal from "./add_meeting_room";
import DeleteDialog from "../../components/DeleteDialog";

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
    setModalOpen(false);  // close modal immediately
    setLoading(true);     // show loader

    try {
      if (selectedRoom) {
        const updatedRoom = {
          ...selectedRoom,
          ...roomData,
          id: selectedRoom.id,
        };
        await updateRoom(updatedRoom)
        // TODO: Replace this comment with actual updateRoom(updatedRoom) API call
        //await fetchRooms();  // refresh full list after edit
      } else {
        console.log("Adding new room:", roomData);
        await addNewRoom(roomData);
        await fetchRooms();  // refresh full list after create
      }

      setSelectedRoom(null);
    } catch (err) {
      console.error("Error saving room:", err);
      setError(`Failed to save room: ${err.message || err}`);
    } finally {
      setLoading(false);
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
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = (e) => {
    setIsDialogOpen(false);
    console.log(`Deleting Item with id: ${e.id}`);
    // Implement actual delete API call and refresh rooms list
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
  };

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
        placeholder="Search locations..."
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
        <RoomsList rooms={rooms} onDelete={handleDelete} onEdit={handleEdit} />
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