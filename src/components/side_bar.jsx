import React from "react";
import { NavLink } from "react-router";
import { useUser } from "../context/UserContext";
import "./side_bar.css";

const navLinkClass = ({ isActive }) =>
  isActive ? "active" : undefined;

const Sidebar = () => {
  const { user, clearUser } = useUser();

  const displayName = user?.name || "Yasir Ghafar";
  const roleLabel = user?.role
    ? `${user.role}${user.companyName ? ` - ${user.companyName}` : " - Daftarkhwan"}`
    : "admin - Daftarkhwan";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "YG";

  const handleLogout = (e) => {
    e.preventDefault();

    if (typeof clearUser === "function") clearUser();

    if (typeof localStorage !== "undefined") localStorage.clear();
    if (typeof sessionStorage !== "undefined") sessionStorage.clear();

    if (typeof document !== "undefined") {
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      });
    }

    window.location.href = "/";
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>ENGAGE</h2>
        <p>Daftarkhwan</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/home/dashboard" className={navLinkClass} end>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/locations" className={navLinkClass}>
              Space
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/meeting-rooms" className={navLinkClass}>
              Meeting Rooms
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/meeting-room-status" className={navLinkClass}>
              Meeting Room Status
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/bookings" className={navLinkClass}>
              Bookings
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/users" className={navLinkClass}>
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/community" className={navLinkClass}>
              Company
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/reports" className={navLinkClass}>
              Report
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-meta">
            <span className="sidebar-user-name">{displayName}</span>
            <span className="sidebar-user-role">{roleLabel}</span>
          </div>
        </div>
        <a href="/" className="sidebar-logout" onClick={handleLogout}>
          Logout
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
