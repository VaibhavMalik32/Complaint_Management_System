const db = require("../config/database");


// Get all complaints
exports.getComplaints = async (req, res) => {
    try {
        const [complaints] = await db.promise().query(`
            SELECT
                c.complaint_id,
                c.subject,
                c.description,
                c.priority,
                c.status,
                c.created_at,
                c.updated_at,

                u.name AS user_name,

                o.name AS organization_name,

                cat.name AS category_name

            FROM complaints c

            JOIN users u
                ON c.user_id = u.user_id

            JOIN organizations o
                ON c.organization_id = o.organization_id

            JOIN categories cat
                ON c.category_id = cat.category_id

            ORDER BY c.created_at DESC
        `);

        res.json({
            success: true,
            complaints
        });

    } catch (error) {

        console.error("Get complaints error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch complaints."
        });
    }
};


// Get one complaint
exports.getComplaint = async (req, res) => {
    try {

        const [complaints] = await db.promise().query(`
            SELECT
                c.complaint_id,
                c.user_id,
                c.organization_id,
                c.category_id,
                c.subject,
                c.description,
                c.priority,
                c.status,
                c.created_at,
                c.updated_at,

                u.name AS user_name,

                o.name AS organization_name,

                cat.name AS category_name

            FROM complaints c

            JOIN users u
                ON c.user_id = u.user_id

            JOIN organizations o
                ON c.organization_id = o.organization_id

            JOIN categories cat
                ON c.category_id = cat.category_id

            WHERE c.complaint_id = ?
        `, [req.params.id]);


        if (complaints.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }


        res.json({
            success: true,
            complaint: complaints[0]
        });

    } catch (error) {

        console.error("Get complaint error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch complaint."
        });
    }
};


// Create complaint
exports.createComplaint = async (req, res) => {

    try {

        const {
            user_id,
            organization_id,
            category_id,
            subject,
            description,
            priority
        } = req.body;


        if (
            !user_id ||
            !organization_id ||
            !category_id ||
            !subject?.trim() ||
            !description?.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "User, organization, category, subject and description are required."
            });
        }


        // Verify that the category belongs to the selected organization

        const [categories] = await db.promise().query(`
            SELECT category_id
            FROM categories
            WHERE category_id = ?
            AND organization_id = ?
        `, [
            category_id,
            organization_id
        ]);


        if (categories.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Selected category does not belong to the selected organization."
            });
        }


        // Insert complaint

        const [result] = await db.promise().query(`
            INSERT INTO complaints
            (
                user_id,
                organization_id,
                category_id,
                subject,
                description,
                priority
            )

            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            user_id,
            organization_id,
            category_id,
            subject.trim(),
            description.trim(),
            priority || "Medium"
        ]);


        // Create initial status update

        await db.promise().query(`
            INSERT INTO complaint_updates
            (
                complaint_id,
                updated_by,
                old_status,
                new_status,
                remarks
            )

            VALUES (?, ?, ?, ?, ?)
        `, [
            result.insertId,
            user_id,
            null,
            "Submitted",
            "Complaint submitted successfully."
        ]);


        // Create notification for the user

        await db.promise().query(`
            INSERT INTO notifications
            (
                user_id,
                complaint_id,
                message
            )

            VALUES (?, ?, ?)
        `, [
            user_id,
            result.insertId,
            `Complaint #${result.insertId} has been submitted successfully.`
        ]);


        // Return created complaint

        const [complaints] = await db.promise().query(`
            SELECT
                c.complaint_id,
                c.subject,
                c.description,
                c.priority,
                c.status,
                c.created_at,

                u.name AS user_name,

                o.name AS organization_name,

                cat.name AS category_name

            FROM complaints c

            JOIN users u
                ON c.user_id = u.user_id

            JOIN organizations o
                ON c.organization_id = o.organization_id

            JOIN categories cat
                ON c.category_id = cat.category_id

            WHERE c.complaint_id = ?
        `, [result.insertId]);


        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully.",
            complaint: complaints[0]
        });


    } catch (error) {

        console.error("Create complaint error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to submit complaint."
        });
    }
};

exports.getUserComplaints = (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT
            c.complaint_id,
            c.subject,
            c.description,
            c.priority,
            c.status,
            c.created_at,
            c.updated_at,
            o.name AS organization_name,
            cat.name AS category_name
        FROM complaints c
        JOIN organizations o
            ON c.organization_id = o.organization_id
        JOIN categories cat
            ON c.category_id = cat.category_id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    `;

    db.query(sql, [userId], (err, complaints) => {
        if (err) {
            console.error("Get user complaints error:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch user complaints"
            });
        }

        res.json({
            success: true,
            complaints
        });
    });
};