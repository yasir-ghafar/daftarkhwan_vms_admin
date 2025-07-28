
const RoomsList = ({rooms}) => {

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
                    <td>✏️</td>
                    <td>🗑️</td>
                  </tr>
                );
            })}
            </tbody>
      </table>
    </div>
    )
}

export default RoomsList;