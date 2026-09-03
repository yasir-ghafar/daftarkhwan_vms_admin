import React, { useMemo, useEffect, useState } from 'react';
import { getLounges, getLoungeByLocation, addNewLounges, deleteLounge, updateLounge, getAmenities } from '../../api/lounges_api';
import { getLocations } from "../../api/locations_api";
import { getCompanies } from "../../api/company_api";
import LoungesForm from "./add_new_lounges";
import { NavLink, useNavigate } from 'react-router';
import ErrorPopup from "../../components/error_popup";
import SuccessPopup from "../../components/confirmation_popup";

import app, { uploadImageToFirebase } from "../../firebase/firebase";
import { useUser } from "../../context/UserContext";

const floors = [
  "Ground Floor",
  "1st Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
  "5th Floor",
  "6th Floor",
  "7th Floor",
  "8th Floor",
  "9th Floor",
];

const Lounges = () => {
    const [search, setSearch] = useState("");
    const [lounges, setLounges] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    
    const [companies, setCompanies] = useState([]);           
    const [selectedLounge, setSelectedLounge] = useState(null); 
    const { role } = useUser();

    const navigate = useNavigate();
    const activeLounges = lounges.filter((lounge) => lounge.status === "active");
    const inactiveLounges = lounges.filter((lounge) => lounge.status === "inactive");


    const fetchLoungesData = async () => {
        setLoading(true);
        try {
            const res = await getLounges();
            // Res may already be the data array (api wrapper returns response.data)
            let payload = res;
            if (res && typeof res === 'object' && Array.isArray(res.data)) payload = res.data;
            if (res && typeof res === 'object' && Array.isArray(res.lounges)) payload = res.lounges;
            const raw = Array.isArray(payload) ? payload : [];
            console.debug("Raw lounges sample:", raw[0]);
            const normalized = raw.map((item) => ({
                id: item.id ?? item._id ?? item.loungeId,
                name: item.name ?? item.lounge_name ?? item.title ?? item.roomName ?? item.loungeName ?? item.Name,
                capacity: item.capacity ?? item.max_capacity ?? item.capacityPerSlot ?? item.capacity_per_slot,
                openingTime: item.openingTime ?? item.opening_time ?? item.opening_time_formatted ?? item.opening_time_raw,
                closingTime: item.closingTime ?? item.closing_time ?? item.closing_time_formatted ?? item.closing_time_raw,
                floor: item.floor ?? item.floor_no ?? item.floorNumber ?? item.level ?? item.floorName ?? item.floor,
                availableDays: item.availableDays ?? item.available_days ?? item.days ?? item.available_days_list,
                status: (item.status ?? item.Status ?? item.state ?? item.roomStatus) || "Active",
                location: (item.location && typeof item.location === 'object') ? { id: item.location.id ?? item.location._id, name: item.location.name ?? item.location.locationName } : (item.locationName ? { id: item.locationId ?? item.LocationId ?? item.locationName, name: item.locationName } : (item.LocationId ? { id: item.LocationId, name: item.locationName || item.LocationName } : null)),
                __raw: item,
            }));
            console.debug("Normalized lounges sample:", normalized[0]);
            setLounges(normalized);
            setTotalItems(normalized.length);
        } catch (err) {
            console.error("Error fetching lounges:", err);
            setError("Failed to load lounges.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoungesData();
    }, []);    

    const handleAddLounge = async (loungeData) => {
        setModalOpen(false);
        setLoading(true);

        try {
          const dataObject = {};
          for (let [key, value] of loungeData.entries()) {
            dataObject[key] = value;
          }
    
          const imageFile = loungeData.get("image");
          if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            try {
              const imageUrl = await uploadImageToFirebase(imageFile);
              dataObject.image = imageUrl;
            } catch (uploadErr) {
              console.error("Image upload failed:", uploadErr);
              alert("Image upload failed. Please try again.");
              return;
            }
          }
    
                    if (selectedLounge) {
                        dataObject.id = selectedLounge.id;
                        await updateLounge(dataObject);
                    } else {
                        await addNewLounges(dataObject);
                    }
    
          await fetchLoungesData();
          if (selectedLounge) setSelectedLounge(null);
        } catch (err) {
          console.error("Save failed:", err.response?.data || err.message);
          alert("Unable to save lounge");
        } finally {
          setLoading(false);
        }
    };    
        
    const openAddNewLounges = async () => {
        if (role === 'admin') {
            setLoading(true);
            try {
              const [locationRes, amenitiesRes] = await Promise.all([
                getLocations(),
                getAmenities(),
              ]);
              setLocations(locationRes.data);
              setAmenities(amenitiesRes.data);
              setSelectedLounge(null);
              setModalOpen(true);
            } catch (err) {
              console.error("Error opening modal:", err);
              setError("Failed to open modal.");
            } finally {
              setLoading(false);
            }
        } else {
            alert("You are not authorized for this action.");
        }
    };

    const handleEdit = async (loungeItem) => {
        setSelectedLounge(loungeItem);
        setLoading(true);
        try {
            const locationRes = await getLocations();
            const matched = locationRes.data.find(
                (loc) => loc.id === loungeItem.location
            );
            setLocations(locationRes.data);
            setSelectedLounge({
                ...loungeItem,
                location: matched?.id || "",
            });
            const amenitiesRes = await getAmenities();
            setAmenities(amenitiesRes.data);
            setModalOpen(true);
        } catch (err) {
            console.error("Error fetching data for edit:", err);
            setError("Could not load room data for editing.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (lounge) => {
        setDeleteMessage(`Are you sure you want to delete? ${lounge.name}`);
        setSelectedLounge(lounge);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDialogOpen(false);
        setLoading(true);
        try {
            await deleteLounge(selectedLounge.id);
            setLounges((prev) => prev.filter((lounge) => lounge.id !== selectedLounge.id));
        } catch (err) {
            alert("Error deleting Meeting Room:" + err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
    };


    const displayedLounges = useMemo(() => {
        // 1. Filter by search, location, and floor
        const filtered = lounges.filter((item) => {
            const searchTerm = search.toLowerCase();
            const matchesSearch =
                item.name?.toLowerCase().includes(searchTerm) ||
                item.location?.name?.toLowerCase().includes(searchTerm) ||
                item.status?.toLowerCase().includes(searchTerm);

            // Make sure property casing matches your API (location vs location)
            const matchesLocation = selectedLocation 
                ? String(item.location || item.location) === String(selectedLocation) 
                : true;
                
            const matchesFloor = selectedFloor 
                ? item.floor === selectedFloor 
                : true;

            return matchesSearch && matchesLocation && matchesFloor;
        });

        // 2. Sort the filtered results if a sort key exists
        if (!sortConfig.key) return filtered;

        return [...filtered].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === "date") {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [lounges, search, selectedLocation, selectedFloor, sortConfig]);

    const formatAvailableDays = (val) => {
        const toAbbrev = (d) => {
            if (d === null || d === undefined) return '';
            const s = String(d).trim();
            if (!s) return '';
            const firstWord = s.split(/[,\s-]+/)[0];
            const ab = firstWord.length >= 3 ? firstWord.slice(0, 3) : firstWord;
            return ab.charAt(0).toUpperCase() + ab.slice(1).toLowerCase();
        };

        const arrayToAbbr = (arr) => arr.map(toAbbrev).filter(Boolean).join(', ');

        if (Array.isArray(val)) return arrayToAbbr(val);

        if (typeof val === 'string') {
            let s = val.trim();

            for (let i = 0; i < 3; i++) {
                if (!s) break;
                if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('"[') && s.endsWith(']"'))) {
                    try {
                        const parsed = JSON.parse(s);
                        if (Array.isArray(parsed)) return arrayToAbbr(parsed);
                        if (typeof parsed === 'string') { s = parsed; continue; }
                        s = String(parsed);
                        break;
                    } catch (e) { break; }
                }
                if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
                    s = s.slice(1, -1);
                    continue;
                }
                break;
            }

            const cleaned = s.replace(/^\[|\]$/g, '').replace(/"/g, '').replace(/'/g, '').trim();
            if (!cleaned) return 'N/A';
            if (cleaned.includes(',')) return arrayToAbbr(cleaned.split(',').map(p => p.trim()));
            return toAbbrev(cleaned) || 'N/A';
        }

        return 'N/A';
    };


    const loungesPerPage = 10;
    
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);
    
    const totalPages = Math.ceil(displayedLounges.length / loungesPerPage) || 1;

    const indexOfLastLounges = currentPage * loungesPerPage;
    const indexOfFirstLounges = indexOfLastLounges - loungesPerPage;
    const currentLounges = displayedLounges.slice(indexOfFirstLounges, indexOfLastLounges);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <div className="flex justify-between p-4 items-center">
                <div className="flex flex-col">
                    <h2 className="text-4xl font-bold">Lounges</h2>
                    <h3 className="text-[#84878d] mt-1">{activeLounges.length} lounges across {new Set(lounges.map((lounge) => lounge.location?.id ?? lounge.location ?? '')).size} locations - {activeLounges.length} currently active</h3>
                </div>
                <button className="text-white font-medium bg-[#3642ee] py-3 px-10 rounded-lg" onClick={openAddNewLounges}>+ Add New Lounge</button>
            </div>

            <div className="flex g-2 my-2 mx-4 rounded-lg border-none">
                <input type="text" placeholder="Search Lounges..." value={search} onChange={(e) => setSearch(e.target.value)} className="my-5 mx-1 py-3 px-5 w-full border border-gray-300 rounded-lg bg-white" />
                
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="my-5 mx-1 py-3 px-5 border border-gray-300 rounded-lg bg-white">
                    <option value="">All Locations</option>
                    {[...new Map(lounges.map((item) => [String(item.location?.id ?? item.location ?? ''), item.location?.name ?? (typeof item.location === 'string' ? item.location : '')])).entries()]
                        .filter(([id]) => id)
                        .map(([id, name]) => (
                        <option key={id} value={id}>{name || id}</option>
                    ))}
                </select>

                <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)} className="my-5 mx-1 py-3 px-5 border border-gray-300 rounded-lg bg-white">
                    <option value="">All Floors</option>
                    {floors.map((floor, idx) => (
                        <option key={idx} value={floor}>{floor}</option>
                    ))}
                </select>
            </div>

            <div>
                <div className="rounded-lg overflow-hidden border mx-4 border-gray-300 bg-white shadow-mist-300">
                    <table className="w-full border-collapse font-sans">
                        <thead className="text-shadow-gray-900 border-b border-b-gray-300">
                            <tr>
                                <th className="p-4 text-left text-sm justify-start">Name</th>
                                <th className="p-2 text-left text-sm">Capacity</th>
                                <th className="p-2 text-left text-sm">Opening Time</th>
                                <th className="p-2 text-left text-sm">Closing Time</th>
                                <th className="p-2 text-left text-sm">Floor</th>
                                <th className="p-2 text-left text-sm">Available Days</th>
                                <th className="p-2 text-left text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentLounges.map((item, index) => (
                                <tr key={index}  className="even:bg-[#f9f9f9] hover:bg-[#f1f5ff]">
                                    <td className="p-4 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{item.name || item.__raw?.name || item.__raw?.lounge_name || item.__raw?.roomName || "N/A"}</td>
                                    <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{item.capacity ?? "N/A"}</td>
                                    <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{item.openingTime ? formatTimeToAMPM(item.openingTime) : "N/A"}</td>
                                    <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{item.closingTime ? formatTimeToAMPM(item.closingTime) : "N/A"}</td>
                                    <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{item.floor ?? item.__raw?.floor ?? item.__raw?.floorName ?? item.__raw?.floor_no ?? "N/A"}</td>
                                    <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{formatAvailableDays(item.availableDays)}</td>
                                    <td className="p-2 border-b border-b-gray-300 text-left text-md font-semibold text-[#3f4144]">{item.status ? item.status : "Active"}</td>
                                </tr>
                            ))}
                            {currentLounges.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="p-4 text-gray-500">No lounges found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="relative">
                    <div className="flex justify-end bottom-0 mt-20">
                        <button type="button" className="text-gray-800 font-medium py-2 px-4 rounded-lg cursor-pointer border border-gray-300 bg-gray-100" onClick={handlePrev} disabled={loading || currentPage <= 1}>&lt;</button>
                        <span className="font-md p-2 font-bold text-[#696c70]">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button type="button" className="bg-[#3642ee] text-white font-medium py-2 px-4 rounded-lg cursor-pointer" onClick={handleNext} disabled={loading || currentPage >= totalPages}>&gt;</button>
                    </div>
                </div>

                <LoungesForm
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleAddLounge}
                    locations={locations}
                    selectedlounges={selectedLounge}
                    amenities={amenities}
                />
            </div>   
        </div>    
    );
};

// Format various time strings to `HH:MM AM/PM` (e.g., `02:00 AM`)
const formatTimeToAMPM = (input) => {
    if (!input && input !== 0) return "N/A";
    let s = String(input).trim();

    // If already contains AM/PM, extract hours and minutes
    const ampmMatch = s.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
    if (ampmMatch) {
        const hh = String(ampmMatch[1]).padStart(2, '0');
        const mm = ampmMatch[2];
        const ap = ampmMatch[3].toUpperCase();
        return `${hh}:${mm} ${ap}`;
    }

    // Match 24-hour times like HH:MM or HH:MM:SS
    const h24 = s.match(/(\d{1,2}):(\d{2})(?::\d{2})?/);
    if (h24) {
        let hh = parseInt(h24[1], 10);
        const mm = h24[2];
        const ap = hh >= 12 ? 'PM' : 'AM';
        hh = hh % 12 || 12;
        return `${String(hh).padStart(2, '0')}:${mm} ${ap}`;
    }

    return s;
}

export default Lounges;