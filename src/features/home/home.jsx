import React, { useState } from "react";
import Sidebar from "../../components/side_bar";
import LocationList from "../locations/locations";
import AddLocationModal from "../locations/add_location_modal";
import { addNewLocation } from "../../api/locations_api";
import { Outlet } from "react-router";

const Home = () => {
  return (
    <div className="flex bg-gray-100">
      <Sidebar/>
      <div className="flex-1 py-5 px-2 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
