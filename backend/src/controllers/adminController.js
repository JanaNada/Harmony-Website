const db = require("../config/db");

const getDashboard = async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM dashboard");
        return res.status(200).json({
            success: true,
            data
        });
    } 
    catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get dashboard data"
        });
    }
};

//#region Companies
const getAllCompanies = async (req, res) => {
    try {
        const [companies] = await db.query(
            `
            SELECT

                u.id,
                u.email,
                u.is_active,

                c.company_name,
                c.contact_name,
                c.contact_phone,
                c.created_at

            FROM companies c

            JOIN users u
            ON c.user_id = u.id

            ORDER BY c.created_at DESC
            `
        );

        return res.status(200).json({
            success: true,
            companies
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve companies."
        });
    }
};

const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const [companies] = await db.query(
            `
            SELECT

                u.id,
                u.email,
                u.is_active,

                c.company_name,
                c.contact_name,
                c.contact_phone,
                c.created_at

            FROM companies c

            JOIN users u
            ON c.user_id = u.id

            WHERE u.id = ?
            `,
            [id]
        );

        if (companies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        return res.status(200).json({
            success: true,
            company: companies[0]
        });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve company."
        });
    }
};

const activateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query(
            `
            UPDATE users
            SET is_active = TRUE
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company activated successfully."
        });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to activate company."
        });
    }
};

const deactivateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query(
            `
            UPDATE users
            SET is_active = FALSE
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company deactivated successfully."
        });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to deactivate company."
        });
    }
};

//#endregion

module.exports = {
    getDashboard,
    getAllCompanies,
    getCompanyById,
    activateCompany,
    deactivateCompany
};
