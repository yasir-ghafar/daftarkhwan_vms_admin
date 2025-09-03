import daftarkhwanApi from "./api"



export const getLocations = async () => {
    const response = await daftarkhwanApi.get("/locations");
    return response.data;
}

export const addNewLocation = async (data) => {
    console.log(data);
    const response = await daftarkhwanApi.post("/locations", data);
    return response.data;
}

export const updateLocation = async (data) => {
    const response = await daftarkhwanApi.put(`/locations/${data.id}`, data);
    return response.data;
}

export const deleteLocation = async (id) => {
    const response = await daftarkhwanApi.delete('/locations/delete/', id);
    return response;
}