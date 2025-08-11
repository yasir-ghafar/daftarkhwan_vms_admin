import daftarkhwanApi from "./api";


export const getUsers = async () => {
  try {
    const response = await daftarkhwanApi.get("/auth/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}