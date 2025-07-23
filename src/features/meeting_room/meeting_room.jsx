import React, { useEffect, useState } from "react";
import { getRooms } from "../../api/rooms_api";
import RoomsList from "./room_list";
import AddRoomModal from "./add_meeting_room";

const MeetingRooms = () => {
    const [search, setSearch] = useState("");
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);

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
            })
    }, []);


  const handleAddRoom = () => {
    
  }
  
  return (
    <div>
      <div className="top-bar">
          <h2>Locations</h2>
          <button className="add-btn" onClick={() => setModalOpen(true)}>Add New</button>
        </div>

        <input
          type="text"
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />


      <RoomsList rooms={rooms} />


      <AddRoomModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddRoom}
        />
    </div>
  );
};

export default MeetingRooms;
