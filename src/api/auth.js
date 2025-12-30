import {getToken} from "../utils/auth";

export async function login(username, password) {
    const response = await fetch("http://localhost:8080/api/auth/login", {
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
        const response = await fetch("http://localhost:8080/api/auth/registry", {
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
        const res = await fetch("http://localhost:8080/api/users/me", {
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
