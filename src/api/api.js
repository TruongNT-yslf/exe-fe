// src/api/api.js

import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_API_URL
const api = axios.create({
    baseURL: `${BACKEND_URL}`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
