import axios from "axios";


const daftarkhwanApi = axios.create({
    baseURL: 'https://daftarkhwan-vms-nodejs.onrender.com/api/v1',
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

//Attach token for protected requests

// daftarkhwanApi.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
// });

export default daftarkhwanApi;