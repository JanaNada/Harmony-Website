import api from "./axios";

// ---------------- Authentication ----------------

export const register = async (companyName, contactName, contactPhone, email, password) => {
    return await api.post("/auth/register", {companyName, contactName, contactPhone, email, password});
};

export const login = async (email, password) => {
    return await api.post("/auth/login", {email, password});
};

export const logout = async () => {
    return await api.post("/auth/logout");
};

export const getCurrentUser = async () => {
    return await api.get("/auth/me");
};

const authApi = {
    register,
    login,
    logout,
    getCurrentUser
};

export { authApi };