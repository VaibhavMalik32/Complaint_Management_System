const db = require("../config/database");

// Get all departments
exports.getDepartments = async (req, res) => {
    try {
        const [departments] = await db.promise().query(`
            SELECT
                d.department_id,
                d.organization_id,
                d.name,
                d.description,
                o.name AS organization_name
            FROM departments d
            JOIN organizations o
                ON d.organization_id = o.organization_id
            ORDER BY d.department_id DESC
        `);

        res.json({
            success: true,
            departments
        });
    } catch (error) {
        console.error("Get departments error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch departments."
        });
    }
};


// Get one department
exports.getDepartment = async (req, res) => {
    try {
        const [departments] = await db.promise().query(`
            SELECT
                d.department_id,
                d.organization_id,
                d.name,
                d.description,
                o.name AS organization_name
            FROM departments d
            JOIN organizations o
                ON d.organization_id = o.organization_id
            WHERE d.department_id = ?
        `, [req.params.id]);

        if (departments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        res.json({
            success: true,
            department: departments[0]
        });
    } catch (error) {
        console.error("Get department error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch department."
        });
    }
};


// Create department
exports.createDepartment = async (req, res) => {
    try {
        const {
            organization_id,
            name,
            description
        } = req.body;

        if (!organization_id || !name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Organization and department name are required."
            });
        }

        const [result] = await db.promise().query(`
            INSERT INTO departments
            (organization_id, name, description)
            VALUES (?, ?, ?)
        `, [
            organization_id,
            name.trim(),
            description?.trim() || null
        ]);

        const [departments] = await db.promise().query(`
            SELECT
                d.department_id,
                d.organization_id,
                d.name,
                d.description,
                o.name AS organization_name
            FROM departments d
            JOIN organizations o
                ON d.organization_id = o.organization_id
            WHERE d.department_id = ?
        `, [result.insertId]);

        res.status(201).json({
            success: true,
            message: "Department created successfully.",
            department: departments[0]
        });
    } catch (error) {
        console.error("Create department error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create department."
        });
    }
};


// Update department
exports.updateDepartment = async (req, res) => {
    try {
        const {
            organization_id,
            name,
            description
        } = req.body;

        if (!organization_id || !name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Organization and department name are required."
            });
        }

        const [result] = await db.promise().query(`
            UPDATE departments
            SET
                organization_id = ?,
                name = ?,
                description = ?
            WHERE department_id = ?
        `, [
            organization_id,
            name.trim(),
            description?.trim() || null,
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        res.json({
            success: true,
            message: "Department updated successfully."
        });
    } catch (error) {
        console.error("Update department error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update department."
        });
    }
};


// Delete department
exports.deleteDepartment = async (req, res) => {
    try {
        const [result] = await db.promise().query(
            "DELETE FROM departments WHERE department_id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        res.json({
            success: true,
            message: "Department deleted successfully."
        });
    } catch (error) {
        console.error("Delete department error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete department."
        });
    }
};