import daftarkhwanApi from "./api";


export const getBookings = async () => {
    const response = await daftarkhwanApi.get("/bookings");
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