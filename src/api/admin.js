import api from "./axios";

// ---------------- Dashboard ----------------

export const getDashboard = async () => {
    return await api.get("/admin/dashboard");
};

// ---------------- Companies ----------------

export const getAllCompanies = async () => {
    return await api.get("/admin/companies");
};

export const getCompanyById = async (id) => {
    return await api.get(`/admin/companies/${id}`);
};

export const updateCompanyStatus = async (id, is_active) => {
    return await api.patch(`/admin/companies/${id}/status`, { is_active });
};

// ---------------- Services ----------------

export const getAllServices = async () => {
    return await api.get("/admin/services");
};

export const getServiceById = async (id) => {
    return await api.get(`/admin/services/${id}`);
};

export const createService = async (title, description) => {
    return await api.post("/admin/services", {title, description});
};

export const updateService = async (id, data) => {
    return await api.patch(`/admin/services/${id}`, data);
};

export const updateServiceStatus = async (id, is_active) => {
    return await api.patch(`/admin/services/${id}/status`, { is_active });
};

const adminApi = {
    getDashboard,

    getAllCompanies,
    getCompanyById,
    updateCompanyStatus,

    getAllServices,
    getServiceById,
    createService,
    updateService,
    updateServiceStatus
};

export { adminApi };