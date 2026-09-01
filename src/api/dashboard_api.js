import daftarkhwanApi from "./api";

const locationParams = (locationId) =>
  locationId ? { location_id: locationId } : undefined;

export const getDashboardSummary = async (locationId) => {
  const response = await daftarkhwanApi.get("/dashboard/summary", {
    params: locationParams(locationId),
  });
  return response.data;
};

export const getTodaysBookings = async (locationId) => {
  const response = await daftarkhwanApi.get("/dashboard/bookings/today", {
    params: locationParams(locationId),
  });
  return response.data;
};

export const getWalletAlerts = async (locationId) => {
  const response = await daftarkhwanApi.get("/dashboard/wallet-alerts", {
    params: locationParams(locationId),
  });
  return response.data;
};

export const getRecentCompanies = async (locationId) => {
  const response = await daftarkhwanApi.get("/dashboard/companies/recent", {
    params: locationParams(locationId),
  });
  return response.data;
};
