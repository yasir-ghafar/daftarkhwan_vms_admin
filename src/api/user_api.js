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

export const addNewUser = async (data) => {
  try {
    const response = await daftarkhwanApi.post("/auth/register/", data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
export const editUser = async (id, data) => {
  try {
    const response = await daftarkhwanApi.put(`/auth/users/edit/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}