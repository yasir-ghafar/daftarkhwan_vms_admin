import React from "react";
import Sidebar from "../../components/side_bar";
import { Outlet } from "react-router";

const Home = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
