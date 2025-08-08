import daftarkhwanApi from "./api";


export const getCompanies = async () => {
    const response = await daftarkhwanApi.get("/company");
    return response.data;
}

export const createCompany = async (data) => {
    const response = await daftarkhwanApi.post("/company", data);
    return response;
}

export const getCompaniesByLocationId = async (id) => {
    const response = await daftarkhwanApi.get(`/company/location-id/${id}`);
    return response;
}