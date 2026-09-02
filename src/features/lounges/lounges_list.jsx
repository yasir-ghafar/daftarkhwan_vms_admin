// import React, { useMemo, useState } from "react";

// const LoungesList = ({ lounges, currentPage, totalPages, onDelete, onEdit, search }) => {
//     const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//     const sortedLounges = useMemo(() => {
//         if (!sortConfig.key) return lounges;
        
//         return [...lounges].sort((a, b) => {
//             let aValue = a[sortConfig.key];
//             let bValue = b[sortConfig.key];
        
//             if (sortConfig.key === "date") {
//                 aValue = new Date(aValue);
//                 bValue = new Date(bValue);
//             }
        
//             if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//             if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//             return 0;
//         });
//     }, [lounges, sortConfig]);


//     const handleNext = () => {
//         if (currentPage < totalPages) onPageChange(currentPage + 1);
//     };

//     const handlePrev = () => {
//         if (currentPage > 1) onPageChange(currentPage - 1);
//     };

//     return(
//         <div>
//             <div className="rounded-[10px] overflow-hidden border border-[#e0e0e0] shadow-[0_4px_12px_rgba(0,0,0,0.04)] bg-white p-0 mt-5">
//                 <table className="w-full border-collapse font-sans">
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Credit Per SLot</th>
//                             <th>Capacity</th>
//                             <th>Opening Time</th>
//                             <th>Closing Time</th>
//                             <th>Floor</th>
//                             <th>Available Days</th>
//                             <th>Location ID</th>
//                             <th>Status</th>
//                             <th>Amenities</th>
//                             <th>Image</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentLounge.map((lounges, index) => (
//                             <tr key={index}>
//                                 <td>{lounges.name}</td>
//                                 <td>{lounges.location?.name ?? "N/A"}</td>
//                                 <td>{lounges.status ?? "Active"}</td>
//                                 <td>
//                                     {to12HourFormat(booking.startTime)} -{" "}
//                                     {to12HourFormat(booking.endTime)}
//                                 </td>
//                                 <td>{lounges.availableSlotsCount ?? "0"}</td>
//                                 <td>
//                                     <span style={{ cursor: "pointer" }} onClick={() => handleEdit(lounges)}>✏️</span>
//                                 </td>
//                                 <td>
//                                     <span style={{ cursor: "pointer" }} onClick={() => handleDelete(lounges)}>🗑️</span>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
            
//             <div className="flex justify-end items-center mt-1.5 gap-1">
//                 <button type="button" className="bg-[#007bff] text-white border-none px-2 py-1 rounded-md text-[13px] cursor-pointer transition-colors duration-200" onClick={handlePrev} disabled={loading || currentPage <= 1}>&lt;</button>
//                 <span className="text-sm text-gray-800 mx-1">
//                     Page {currentPage} of {totalPages}
//                     {totalItems > 0 ? ` (${totalItems} total)` : ""}
//                 </span>
//                 <button type="button" className="bg-[#007bff] text-white border-none px-2 py-1 rounded-md text-[13px] cursor-pointer transition-colors duration-200" onClick={handleNext} disabled={loading || currentPage >= totalPages}>&gt;</button>
//             </div>
//         </div>
//     );
    
// };

// export default LoungesList