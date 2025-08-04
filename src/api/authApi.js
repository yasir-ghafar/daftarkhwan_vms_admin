import daftarkhwanApi from "./api";

export const login = async (email, password) => {
    console.log(`Attempting login with email: ${email}`);

    try {
        const response = await daftarkhwanApi.post('/auth/login', { email, password });

        console.log(response.data.data);
        if (response.status === 200 && response.data?.data.authorization) {
            const { authorization, user } = response.data?.data;

            // ✅ Store token
            localStorage.setItem('token', authorization);

            // Optionally store user data too
            localStorage.setItem('user', JSON.stringify(user));

            console.log('Login successful, token stored.');
            return response.data;
        } else {
            throw new Error('Login failed: No token received');
        }
    } catch (err) {
        console.error('Login error:', err.response?.data || err.message);
        throw err;
    }
}