import daftarkhwanApi from "./api"



export const getRooms = async () => {
    const response = await daftarkhwanApi.get('/meeting-rooms');
    return response.data;
}

export const addNewRoom = async (data) => {
    console.log(data);
    const response = await daftarkhwanApi.post('/meeting-rooms', data);
    return response.data;
}

export const getRoomByLocationId = async (id) => {
    const response = await daftarkhwanApi.get(`/meeting-rooms/location/${id}`)
    return response.data;
}

export const updateRoom = async (data) => {
    console.log(data);
    const response = await daftarkhwanApi.put(`/meeting-rooms/${data.id}`, data);
    return response.data;
}

export const getAmenities = async () => {
    const response = await daftarkhwanApi.get('/amenities');
    return response.data;
}