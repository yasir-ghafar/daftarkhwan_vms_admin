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

export const updateWalletBalance = async (id, data) => {
    console.log("Wallet Id: ", id);
    console.log("Data", data);
    const response = await daftarkhwanApi.put(`/company/wallets/${id}`, data);
    return response;
}


export const getWalletTransactions = async (id) => {
    const response = await daftarkhwanApi.get(`/company/wallet/transactions/${id}`)
    return response.data;
}