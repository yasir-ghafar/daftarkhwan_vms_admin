import axios from "axios";


const daftarkhwanApi = axios.create({
    //baseURL: 'https://daftarkhwan-vms-nodejs.onrender.com/api/v1',
    baseURL: 'https://engage-app.astererp.com/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 🔐 Automatically attach token to every request if available
daftarkhwanApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default daftarkhwanApi;