const db = require("../config/database");

// Get all staff
exports.getStaff = async (req, res) => {
    try {
        const [staff] = await db.promise().query(`
            SELECT
                s.staff_id,
                s.user_id,
                s.department_id,
                s.designation,
                u.name AS user_name,
                u.email,
                d.name AS department_name,
                o.name AS organization_name
            FROM staff s
            JOIN users u
                ON s.user_id = u.user_id
            JOIN departments d
                ON s.department_id = d.department_id
            JOIN organizations o
                ON d.organization_id = o.organization_id
            ORDER BY s.staff_id DESC
        `);

        res.json({
            success: true,
            staff
        });

    } catch (error) {
        console.error("Get staff error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch staff."
        });
    }
};


// Get available users
exports.getAvailableUsers = async (req, res) => {
    try {
        const [users] = await db.promise().query(`
            SELECT
                u.user_id,
                u.name,
                u.email
            FROM users u
            LEFT JOIN staff s
                ON u.user_id = s.user_id
            WHERE s.staff_id IS NULL
            ORDER BY u.name
        `);

        res.json({
            success: true,
            users
        });

    } catch (error) {
        console.error("Get available users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch available users."
        });
    }
};


// Create staff
exports.createStaff = async (req, res) => {
    try {
        const {
            user_id,
            department_id,
            designation
        } = req.body;

        if (!user_id || !department_id || !designation?.trim()) {
            return res.status(400).json({
                success: false,
                message: "User, department and designation are required."
            });
        }

        // Check whether user is already staff
        const [existingStaff] = await db.promise().query(
            "SELECT staff_id FROM staff WHERE user_id = ?",
            [user_id]
        );

        if (existingStaff.length > 0) {
            return res.status(400).json({
                success: false,
                message: "This user is already a staff member."
            });
        }

        // Check department exists
        const [departments] = await db.promise().query(
            "SELECT department_id FROM departments WHERE department_id = ?",
            [department_id]
        );

        if (departments.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Selected department does not exist."
            });
        }

        const [result] = await db.promise().query(`
            INSERT INTO staff
            (
                user_id,
                department_id,
                designation
            )
            VALUES (?, ?, ?)
        `, [
            user_id,
            department_id,
            designation.trim()
        ]);

        // Change user's role to staff
        await db.promise().query(
            "UPDATE users SET role = 'staff' WHERE user_id = ?",
            [user_id]
        );

        res.status(201).json({
            success: true,
            message: "Staff member created successfully.",
            staff_id: result.insertId
        });

    } catch (error) {
        console.error("Create staff error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create staff member."
        });
    }
};


// Delete staff
exports.deleteStaff = async (req, res) => {
    try {
        const [staff] = await db.promise().query(
            "SELECT user_id FROM staff WHERE staff_id = ?",
            [req.params.id]
        );

        if (staff.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Staff member not found."
            });
        }

        const userId = staff[0].user_id;

        await db.promise().query(
            "DELETE FROM staff WHERE staff_id = ?",
            [req.params.id]
        );

        // Return the user to normal user role
        await db.promise().query(
            "UPDATE users SET role = 'user' WHERE user_id = ?",
            [userId]
        );

        res.json({
            success: true,
            message: "Staff member deleted successfully."
        });

    } catch (error) {
        console.error("Delete staff error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete staff member."
        });
    }
};
