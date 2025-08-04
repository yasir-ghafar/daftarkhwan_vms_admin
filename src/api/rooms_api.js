import daftarkhwanApi from "./api"



export const getRooms = async () => {
    const response = await daftarkhwanApi.get('/meeting-rooms');
    return response.data;
}

export const addNewRoom = async (data) => {
    console.log(data);
    const response = await daftarkhwanApi.post('', data);
    return response.data;
}
