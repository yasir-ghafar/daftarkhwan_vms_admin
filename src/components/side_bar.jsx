import React from 'react';
import { NavLink } from 'react-router';
// import './side_bar.css';

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
    <div className="w-64 bg-[#0A0F1C] min-h-screen flex flex-col p-5 font-sans border-r border-[#e6e6e6]">
      <h2 className="text-xl font-bold text-white px-2">Engage</h2>
      <h3 className="text-[#84878d] font-normal px-2">Daftarkhwan</h3>
      <nav className="mt-10 flex-1 ">
        <ul>
          <li className="mb-2 font-semibold text-[#84878d] p-2 hover:bg-blue-900 hover:text-white hover:rounded-lg hover:p-2"><NavLink to="/home/locations">Space</NavLink></li>
          <li className="mb-2 font-semibold text-[#84878d] p-2 hover:bg-blue-900 hover:text-white hover:rounded-lg hover:p-2"><NavLink to="/home/meeting-rooms">Meeting Rooms</NavLink></li>
          <li className="mb-2 font-semibold text-[#84878d] p-2 hover:bg-blue-900 hover:text-white hover:rounded-lg hover:p-2"><NavLink to="/home/meeting-room-status">Meeting Room Status</NavLink></li>
          <li className="mb-2 font-semibold text-[#84878d] p-2 hover:bg-blue-900 hover:text-white hover:rounded-lg hover:p-2"><NavLink to="/home/bookings">Bookings</NavLink></li>
          <li className="mb-2 font-semibold text-[#84878d] p-2 hover:bg-blue-900 hover:text-white hover:rounded-lg hover:p-2"><NavLink to="/home/lounges">Lounges</NavLink></li>
          <li className="mb-2 font-semibold text-[#84878d] p-2 hover:bg-blue-900 hover:text-white hover:rounded-lg hover:p-2"><NavLink to="/home/users">Users</NavLink></li>
          <li className="mb-2 font-semibold text-[#84878d] p-2 hover:bg-blue-900 hover:text-white hover:rounded-lg hover:p-2"><NavLink to="/home/community">Company</NavLink></li>
          <li className="mb-2 font-semibold text-[#84878d] p-2 hover:bg-blue-900 hover:text-white hover:rounded-lg hover:p-2"><NavLink to="/home/reports">Reports</NavLink></li>
          <ul className="fixed bottom-0 border-t-[#84878d]">
            <li className="text-white text-lg px-9 font-sans">User Name</li>
            <li className="text-[#84878d] text-sm px-9 font-sans">admin - Daftarkhwan</li>
            <li className="font-semibold text-red-600 p-2 hover:bg-blue-900 hover:text-white hover:rounded-lg hover:p-2">
              <a href="/" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
