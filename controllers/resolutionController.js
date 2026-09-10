const db = require("../config/database");


// Get resolution for a complaint
exports.getResolution = async (req, res) => {
    try {
        const [resolutions] = await db.promise().query(`
            SELECT
                r.resolution_id,
                r.complaint_id,
                r.resolved_by,
                r.resolution_text,
                r.resolved_at,
                u.name AS resolved_by_name
            FROM resolutions r
            JOIN users u
                ON r.resolved_by = u.user_id
            WHERE r.complaint_id = ?
        `, [req.params.complaintId]);

        res.json({
            success: true,
            resolution: resolutions.length
                ? resolutions[0]
                : null
        });

    } catch (error) {
        console.error("Get resolution error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch resolution."
        });
    }
};


// Create resolution
exports.createResolution = async (req, res) => {
    try {
        const {
            resolved_by,
            resolution_text
        } = req.body;

        const complaintId =
            req.params.complaintId;


        if (!resolved_by || !resolution_text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Resolver and resolution text are required."
            });
        }


        // Check complaint
        const [complaints] = await db.promise().query(`
            SELECT
                complaint_id,
                user_id,
                status
            FROM complaints
            WHERE complaint_id = ?
        `, [complaintId]);


        if (complaints.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }


        const complaint = complaints[0];


        if (
            complaint.status !== "In Progress" &&
            complaint.status !== "Assigned"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "A complaint must be assigned or in progress before it can be resolved."
            });
        }


        // Check if resolution already exists
        const [existing] = await db.promise().query(
            "SELECT resolution_id FROM resolutions WHERE complaint_id = ?",
            [complaintId]
        );


        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "This complaint already has a resolution."
            });
        }


        // Insert resolution
        await db.promise().query(`
            INSERT INTO resolutions
            (
                complaint_id,
                resolved_by,
                resolution_text
            )
            VALUES (?, ?, ?)
        `, [
            complaintId,
            resolved_by,
            resolution_text.trim()
        ]);


        // Change complaint status
        await db.promise().query(`
            UPDATE complaints
            SET status = 'Resolved'
            WHERE complaint_id = ?
        `, [complaintId]);


        // Add status history
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
            complaintId,
            resolved_by,
            complaint.status,
            "Resolved",
            "Complaint resolved."
        ]);


        // Notify user
        await db.promise().query(`
            INSERT INTO notifications
            (
                user_id,
                complaint_id,
                message
            )
            VALUES (?, ?, ?)
        `, [
            complaint.user_id,
            complaintId,
            `Complaint #${complaintId} has been resolved.`
        ]);


        res.status(201).json({
            success: true,
            message: "Complaint resolved successfully."
        });


    } catch (error) {
        console.error("Create resolution error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create resolution."
        });
    }
};


// Close complaint
exports.closeComplaint = async (req, res) => {
    try {
        const {
            closed_by,
            remarks
        } = req.body;

        const complaintId =
            req.params.complaintId;


        if (!closed_by) {
            return res.status(400).json({
                success: false,
                message: "User closing the complaint is required."
            });
        }


        const [complaints] = await db.promise().query(`
            SELECT
                complaint_id,
                user_id,
                status
            FROM complaints
            WHERE complaint_id = ?
        `, [complaintId]);


        if (complaints.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }


        const complaint = complaints[0];


        if (complaint.status !== "Resolved") {
            return res.status(400).json({
                success: false,
                message:
                    "Only resolved complaints can be closed."
            });
        }


        // Update status
        await db.promise().query(`
            UPDATE complaints
            SET status = 'Closed'
            WHERE complaint_id = ?
        `, [complaintId]);


        // Add history
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
            complaintId,
            closed_by,
            "Resolved",
            "Closed",
            remarks?.trim() || "Complaint closed."
        ]);


        // Notify user
        await db.promise().query(`
            INSERT INTO notifications
            (
                user_id,
                complaint_id,
                message
            )
            VALUES (?, ?, ?)
        `, [
            complaint.user_id,
            complaintId,
            `Complaint #${complaintId} has been closed.`
        ]);


        res.json({
            success: true,
            message: "Complaint closed successfully."
        });


    } catch (error) {
        console.error("Close complaint error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to close complaint."
        });
    }
};