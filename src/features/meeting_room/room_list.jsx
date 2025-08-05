const RoomsList = ({ rooms, onDelete, onEdit }) => {
  const handleEdit = (room) => {
    onEdit(room);
  };

  const handleDelete = (room) => {
    onDelete(room);
  };

  return (
    <div className="table-container">
      <table className="location-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Status</th>
            <th>Available Slots</th>
            <th>Actions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={index}>
              <td>{room.name}</td>
              <td>{room.location?.name ?? 'N/A'}</td>
              <td>{room.Status ?? 'Active'}</td>
              <td>{room.availableSlotsCount ?? '0'}</td>
              <td>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleEdit(room)}
                >
                  ✏️
                </span>
              </td>
              <td>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(room)}
                >
                  🗑️
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomsList;
