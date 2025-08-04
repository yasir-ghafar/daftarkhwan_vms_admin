import React, { useEffect, useState } from "react";
import { getRooms } from "../../api/rooms_api";
import RoomsList from "./room_list";
import AddRoomModal from "./add_meeting_room";
import DeleteDialog from "../../components/DeleteDialog";

const MeetingRooms = () => {

    const [search, setSearch] = useState("");
    const [rooms, setRooms] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
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

  const handleAddRoom = (newRoom) => {
    console.log('New Room Object:', newRoom);
    // Example: add to list
    //setRooms(prevRooms => [...prevRooms, newRoom]);
    // TODO: also send to backend if needed
  };

  

  const handleDelete = (room) => {

    console.log(id);
    setDeleteMessage(`Are you sure you want to delete? ${room.name}`)
    setIsDialogOpen(true);
  };

  const handleEdit = (id) => {
    console.log(id);
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
        <button className="add-btn" onClick={() => setModalOpen(true)}>Add New</button>
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
        onClose={() => setModalOpen(false)}
        onSave={handleAddRoom}
      />
    </div>
  );
};

export default MeetingRooms;
