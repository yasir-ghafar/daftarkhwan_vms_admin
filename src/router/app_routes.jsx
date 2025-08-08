import React from "react";
import { Routes, Route } from 'react-router';
import LoginPage from "../features/auth/login_page";
import Home from "../features/home/home";
import Locations from "../features/locations/locations";
import MeetingRooms from "../features/meeting_room/meeting_room";
import Bookings from "../features/bookings/bookings";
import Companies from "../features/community/companies";
import Users from "../features/user/user";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={ <LoginPage/>}/>
        <Route path="/home" element={ <Home/>}>
            <Route path="locations" element={<Locations />}/>
            <Route path="meeting-rooms" element={<MeetingRooms/>}/>
            <Route path="bookings" element={<Bookings />}/>
            <Route path="community" element={<Companies/>}/>
            <Route path="users" element={<Users/>}/>
        </Route>
    </Routes>
);


export default AppRoutes;