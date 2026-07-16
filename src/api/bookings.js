import daftarkhwanApi from "./api";


export const getBookings = async ({ page = 1, page_size = 10 } = {}) => {
    const response = await daftarkhwanApi.get("/bookings", {
        params: { page, page_size },
    });
    return response.data;
}

export const addNewBooking = async (data) => {
    console.log(data);
    const response = await daftarkhwanApi.post("/bookings", data);
    return response;
}


export const cancelBooking = async (id) => {
    const response = await daftarkhwanApi.post(`/bookings/cancel/${id}`);
    return response;
}

export const getBookingsByRoomAndDate = async (roomId, date) => {
    const response = await daftarkhwanApi.get("/bookings/by-room-and-date", {
        params: { room_id: roomId, date },
    });
    return response.data;
}
