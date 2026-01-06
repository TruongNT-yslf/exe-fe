import { getToken } from "../utils/auth";

export const fetchUserProfile = async () => {
    const token = getToken();
    if (!token) return null;

    const res = await fetch("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data;
};

export const updateUserProfile = async (payload) => {
    const token = getToken();
    if (!token) throw new Error("No token");

    const res = await fetch("http://localhost:8080/api/users/me", {
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
