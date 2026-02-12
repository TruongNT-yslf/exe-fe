import {getToken} from "../utils/auth";
import api from "./api";
const BACKEND_URL = process.env.REACT_APP_API_URL
export async function login(username, password) {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Login failed";
        throw new Error(errorMessage);
    }

    return response.json(); // { token, expiration }
}


export async function signup(username, password, email, fullName) {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/registry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email, fullName}),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || "Registration failed";
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message || "Network error");
    }
}
export const getUser = async () => {
    const token = getToken();
    console.log("token from localStorage:", token);
    if (!token) return null;
    try {
        const res = await fetch(`${BACKEND_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await res.json();
        if (!res.ok) return null;
        return result.data;
    } catch (e) {
        console.error("getUser error:", e);
        return null;
    }
}

export const changePassword = (oldPassword, newPassword) => {
    return api.post("/users/change-password", { oldPassword, newPassword });
};

export const forgotPassword = (key) => {
    return api.post("/auth/forgot-password", key, {
        headers: { "Content-Type": "text/plain" }
    });
};

// Lấy danh sách đơn hàng theo userId
export const getUserOrders = async (params) => {
    const token = getToken();
    let url = `${BACKEND_URL}/orders/my-orders?userId=${params.userId}&page=${params.page}&size=${params.size}`;
    if (params.status) {
        url += `&status=${params.status}`;
    }

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
}

export const cancelOrder = async (orderId, note) => {
    const token = getToken();
    let url = `${BACKEND_URL}/orders/my-orders/${orderId}?note=${encodeURIComponent(note)}`;
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
}