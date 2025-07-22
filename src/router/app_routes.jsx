import React from "react";
import { Routes, Route } from 'react-router';
import LoginPage from "../features/auth/login_page";
import Home from "../features/home/home";
import Locations from "../features/locations/locations";
import MeetingRooms from "../features/meeting_room/meeting_room";
import Community from "../features/community/community";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={ <LoginPage/>}/>
        <Route path="/home" element={ <Home/>}>
            <Route path="locations" element={<Locations />}/>
            <Route path="meeting-rooms" element={<MeetingRooms/>}/>
            <Route path="community" element={<Community/>}/>
        </Route>
    </Routes>
);


export default AppRoutes;