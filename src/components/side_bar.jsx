import React from 'react';
import { NavLink } from 'react-router';
import './side_bar.css';

const Sidebar = () => {
  const handleLogout = (e) => {
    e.preventDefault();

    // Clear localStorage and sessionStorage
    if (typeof localStorage !== 'undefined') localStorage.clear();
    if (typeof sessionStorage !== 'undefined') sessionStorage.clear();

    // Clear cookies for current domain
    if (typeof document !== 'undefined') {
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      });
    }

    // Redirect to login/home page
    window.location.href = "/";
  };

  return (
    <div className="sidebar">
      <h2>ENGAGE</h2>
      <nav>
        <ul>
          <li><NavLink to="/home/locations" activeClassName="active">Space</NavLink></li>
          <li><NavLink to="/home/meeting-rooms" activeClassName="active">Meeting Rooms</NavLink></li>
          <li><NavLink to="/home/bookings" activeClassName="active">Bookings</NavLink></li>
          <li><NavLink to="/home/users" activeClassName="active">Users</NavLink></li>
          <li><NavLink to="/home/community" activeClassName="active">Company</NavLink></li>
          <li>
            <a href="/" onClick={handleLogout}>
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
