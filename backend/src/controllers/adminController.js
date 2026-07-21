const db = require("../config/db");

const getDashboard = async (req, res) => {
    try {

        const [[companies]] = await db.query(`
            SELECT
                COUNT(*) AS totalCompanies,
                SUM(is_active = TRUE) AS activeCompanies,
                SUM(is_active = FALSE) AS inactiveCompanies
            FROM users
            WHERE role = 'COMPANY'
        `);

        const [[services]] = await db.query(`
            SELECT
                COUNT(*) AS totalServices,
                SUM(is_active = TRUE) AS activeServices,
                SUM(is_active = FALSE) AS inactiveServices
            FROM services
        `);

        return res.status(200).json({
            success: true,
            stats: {
                ...companies,
                ...services
            }
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve dashboard."
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

            WHERE c.id = ?
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

const updateCompanyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const [result] = await db.query(`
            UPDATE users u
            JOIN companies c
            ON u.id = c.user_id

            SET u.is_active = ?

            WHERE c.id = ?
        `, [is_active, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company status updated successfully.",
            is_active
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update company status."
        });
    }
};

//#endregion

//#region Services

const getAllServices = async (req, res) => {
    try {
        const [services] = await db.query(`
            SELECT *
            FROM services
            ORDER BY created_at DESC
        `);

        return res.status(200).json({
            success: true,
            services
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve services."
        });
    }
};

const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const [services] = await db.query(`
            SELECT *
            FROM services
            WHERE id = ?
        `, [id]);

        if (services.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Service not found."
            });
        }

        return res.status(200).json({
            success: true,
            service: services[0]
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve service."
        });
    }
};

const createService = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Service title is required."
            });
        }

        const [result] = await db.query(`
            INSERT INTO services (title, description)
            VALUES (?, ?)
        `, [title, description || null]);

        return res.status(201).json({
            success: true,
            message: "Service created successfully.",
            serviceId: result.insertId
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create service."
        });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const [result] = await db.query(`
            UPDATE services
            SET title = ?, description = ?
            WHERE id = ?
        `, [title, description, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Service not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Service updated successfully."
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update service."
        });
    }
};

const updateServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const [result] = await db.query(`
            UPDATE services
            SET is_active = ?
            WHERE id = ?
        `, [is_active, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Service not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Service status updated successfully.",
            is_active
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update service status."
        });
    }
};

//#endregion


module.exports = {
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
