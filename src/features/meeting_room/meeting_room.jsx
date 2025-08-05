import React, { useEffect, useState } from "react";
import { getRooms, addNewRoom, getAmenities } from "../../api/rooms_api";
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
    const [deleteMesssage, setDeleteMessage] = useState('');

  useEffect(() => {
    getRooms()
      .then((data) => {
        console.log(data.data);
        setRooms(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error Fetching Meeting Rooms:', err);
        setLoading(false);
      });
  }, []);

  const handleAddRoom = async (roomData) => {
    console.log('Room Data:', roomData);
    setLoading(true);
    try {
      if (selectedRoom) {
        // update flow
        const updatedRoom = { ...selectedRoom, ...roomData };
        // call your update API here
        //const roomData = await updateRoom(updatedRoom);
        // mock update:
        setRooms((prev) =>
          prev.map((room) =>
            room.id === selectedRoom.id ? updatedRoom : room
          )
        );
      } else {
        // create flow
        const data = await addNewRoom(roomData);
        setRooms((prev) => [...prev, data.data]);
      }
      setLoading(false);
      setSelectedRoom(null);
    } catch (err) {
      
      setError(`Failed to Save Meeting Room: ${err}`);
      setLoading(false);
    }
  };

  const openAddNewRoom = async () => {
    setLoading(true);
    try {
      const [locationRes, amenitiesRes] = await Promise.all([
        getLocations(),
        getAmenities()
      ]);

      setLocations(locationRes.data);
      setAmenities(amenitiesRes.data);
      setLoading(false);
      setModalOpen(true);
    } catch(err) {
        console.error('Error Fetching Meeting Rooms:', err);
        setLoading(false);
    }
  }


  const handleDelete = (room) => {

    console.log(room.id);
    setDeleteMessage(`Are you sure you want to delete? ${room.name}`)
    setIsDialogOpen(true);
  };

  const handleEdit = async (room) => {
    console.log("Editing Room:", room);
    setSelectedRoom(room);
    setLoading(true);
    try {
      const data = await getLocations();
      const locationList = data.data;
      setLocations(locationList);

      // Match the room's location ID to the location object
      const matchedLocation = locationList.find(loc => loc.id === room.location_id);
      if (matchedLocation) {
        setSelectedRoom({
          ...room,
          location: matchedLocation,
          locationId: matchedLocation.id
        });
      } else {
        setSelectedRoom(room);
      }

      setModalOpen(true);
    } catch (err) {
      console.error('Error Fetching Locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = (e) => {
    setIsDialogOpen(false);
    console.log( `Deleting Item with id: ${e.id}`);
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
  } 

  return (
    <div>
      <div className="top-bar">
        <h2>Meeting Rooms</h2>
        <button className="add-btn" onClick={openAddNewRoom}>Add New</button>
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
            <p> Loading please wait....</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <RoomsList rooms={rooms}
         onDelete={handleDelete}
         onEdit={handleEdit}/>
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
