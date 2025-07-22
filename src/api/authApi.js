import daftarkhwanApi from "./api";

export const login = async (email, password) => {
    console.log(`Attempting login with email: ${email}`);

    try {
        const response = await daftarkhwanApi.post('/auth/login', {email, password});
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        return response.data;
    } catch (err) {
        console.error('Login error:', err.response?.data || err.message);
    throw err;
    }

}