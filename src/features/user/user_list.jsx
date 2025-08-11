const UsersList = ({ users, onDelete, onEdit }) => {
  const handleEdit = (user) => {
    onEdit(user);
  };

  const handleDelete = (user) => {
    onDelete(user);
  };

  return (
    <div className="table-container">
      <table className="location-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Company</th>
            <th>Actions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.company?.name ?? 'N/A'}</td>
              <td>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleEdit(user)}
                >
                  ✏️
                </span>
              </td>
              <td>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(user)}
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

export default UsersList;
