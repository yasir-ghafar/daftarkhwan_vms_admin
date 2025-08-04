const RoomsList = ({ rooms, onDelete, onEdit }) => {
  
  
  const handleEdit = (e) => {
    onEdit(e);
    console.log(e);
  };

  const handleDelete = (e) => {
    console.log(e);
    onDelete(e);
  };

  return (
    <div className="table-container">
      <table className="location-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => {
            return (
              <tr key={index}>
                <td>{room.name}</td>
                <td>{room.locationName}</td>
                <td>Active</td>
                <td>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEdit(room)}
                  >
                    ✏️
                  </span>
                </td>
                <td>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(room)}
                  >
                    🗑️
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RoomsList;
