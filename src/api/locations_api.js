import daftarkhwanApi from "./api"



export const getLocations = async () => {
    const response = await daftarkhwanApi.get("/locations");
    return response.data;
}

export const addNewLocation = async (data) => {
    console.log(data);
    //const response = await daftarkhwanApi.post("/locations", data);
    //return response.data;
}