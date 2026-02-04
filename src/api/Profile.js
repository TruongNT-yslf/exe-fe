import { getToken } from "../utils/auth";
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
export const fetchUserProfile = async () => {
    const token = getToken();
    if (!token) return null;

    const res = await fetch(`${BACKEND_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data;
};

export const updateUserProfile = async (payload) => {
    const token = getToken();
    if (!token) throw new Error("No token");

    const res = await fetch(`${BACKEND_URL}/users/me`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
        throw new Error(json?.message || "Update failed");
    }

    return json;
};
