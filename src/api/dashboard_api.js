import daftarkhwanApi from "./api";

export const getDashboardSummary = async () => {
  const response = await daftarkhwanApi.get("/dashboard/summary");
  return response.data;
};

export const getTodaysBookings = async () => {
  const response = await daftarkhwanApi.get("/dashboard/bookings/today");
  return response.data;
};

export const getWalletAlerts = async () => {
  const response = await daftarkhwanApi.get("/dashboard/wallet-alerts");
  return response.data;
};

export const getRecentCompanies = async () => {
  const response = await daftarkhwanApi.get("/dashboard/companies/recent");
  return response.data;
};
