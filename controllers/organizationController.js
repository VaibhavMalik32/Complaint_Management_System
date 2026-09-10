const db = require("../config/database");

exports.getOrganizations = async (req, res) => {
    try {
        const [organizations] = await db.promise().query(
            "SELECT * FROM organizations ORDER BY created_at DESC"
        );

        res.json({
            success: true,
            organizations
        });
    } catch (error) {
        console.error("Get organizations error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch organizations."
        });
    }
};

exports.getOrganization = async (req, res) => {
    try {
        const [organizations] = await db.promise().query(
            "SELECT * FROM organizations WHERE organization_id = ?",
            [req.params.id]
        );

        if (organizations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Organization not found."
            });
        }

        res.json({
            success: true,
            organization: organizations[0]
        });
    } catch (error) {
        console.error("Get organization error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch organization."
        });
    }
};

exports.createOrganization = async (req, res) => {
    try {
        const { name, type, description } = req.body;

        if (!name?.trim() || !type?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Organization name and type are required."
            });
        }

        const [result] = await db.promise().query(
            `INSERT INTO organizations (name, type, description)
             VALUES (?, ?, ?)`,
            [name.trim(), type.trim(), description?.trim() || null]
        );

        const [organizations] = await db.promise().query(
            "SELECT * FROM organizations WHERE organization_id = ?",
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Organization created successfully.",
            organization: organizations[0]
        });
    } catch (error) {
        console.error("Create organization error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create organization."
        });
    }
};

exports.updateOrganization = async (req, res) => {
    try {
        const { name, type, description } = req.body;

        if (!name?.trim() || !type?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Organization name and type are required."
            });
        }

        const [result] = await db.promise().query(
            `UPDATE organizations
             SET name = ?, type = ?, description = ?
             WHERE organization_id = ?`,
            [
                name.trim(),
                type.trim(),
                description?.trim() || null,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Organization not found."
            });
        }

        const [organizations] = await db.promise().query(
            "SELECT * FROM organizations WHERE organization_id = ?",
            [req.params.id]
        );

        res.json({
            success: true,
            message: "Organization updated successfully.",
            organization: organizations[0]
        });
    } catch (error) {
        console.error("Update organization error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update organization."
        });
    }
};

exports.deleteOrganization = async (req, res) => {
    try {
        const [result] = await db.promise().query(
            "DELETE FROM organizations WHERE organization_id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Organization not found."
            });
        }

        res.json({
            success: true,
            message: "Organization deleted successfully."
        });
    } catch (error) {
        console.error("Delete organization error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete organization."
        });
    }
};