import React from 'react';
import { Link } from 'react-router';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>ENGAGE</h2>
      <nav>
        <ul>
          <li><Link to="/home/locations">Space</Link></li>
          <li><Link to="/home/meeting-rooms">Meeting Rooms</Link></li>
          <li><Link to="/home/bookings">Bookings</Link></li>
          <li><Link to="/home/users">Users</Link></li>
          <li><Link to="/home/community">Company</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;