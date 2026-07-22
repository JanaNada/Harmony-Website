import api from "./axios";

// ---------------- Company Dashboard ----------------

export const getCompanyDashboard = async () => {
    return await api.get("/company-dashboard");
};

export const sendCompanyContactMessage = async (name, email, serviceInterest, message) => {
    return await api.post("/company-dashboard/contact", { name, email, serviceInterest, message });
};

export const getMyContactMessages = async () => {
    return await api.get("/company-dashboard/contact");
};

const companyDashboardApi = {
    getCompanyDashboard,
    sendCompanyContactMessage,
    getMyContactMessages
};

export { companyDashboardApi };
