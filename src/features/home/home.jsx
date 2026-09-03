import React, { useState } from "react";
import Sidebar from "../../components/side_bar";
import LocationList from "../locations/locations";
import AddLocationModal from "../locations/add_location_modal";
import { addNewLocation } from "../../api/locations_api";
import { Outlet } from "react-router";

const Home = () => {
  return (
    <div className="flex h-screen bg-brand-white-dim">
      <Sidebar/>
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
