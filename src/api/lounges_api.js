import daftarkhwanApi from "./api"



export const getLounges = async () => {
    const response = await daftarkhwanApi.get('/lounges');
    return response.data;
}

export const getLoungeByLocation = async (id) => {
    const response = await daftarkhwanApi.get(`/meeting-rooms/location/${id}`)
    return response.data;
}


export const addNewLounges = async (data) => {
    console.log(data);
    const response = await daftarkhwanApi.post('/lounges', data);
    return response.data;
}

export const deleteLounge = async (id) => {
    const response = await daftarkhwanApi.delete(`lounges/delete/${id}`)
    return response;
}

export const updateLounge = async (data) => {
    console.log(data);
    const response = await daftarkhwanApi.put(`/lounges/${data.id}`, data);
    return response.data;
}

export const getAmenities = async () => {
    const response = await daftarkhwanApi.get('/amenities');
    return response.data;
}

