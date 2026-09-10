const db = require("../config/database");


// Get feedback for a complaint
exports.getFeedback = async (req, res) => {
    try {
        const [feedback] = await db.promise().query(`
            SELECT
                f.feedback_id,
                f.complaint_id,
                f.user_id,
                f.rating,
                f.comment,
                f.submitted_at,
                u.name AS user_name
            FROM feedback f
            JOIN users u
                ON f.user_id = u.user_id
            WHERE f.complaint_id = ?
        `, [req.params.complaintId]);


        res.json({
            success: true,
            feedback: feedback.length
                ? feedback[0]
                : null
        });

    } catch (error) {
        console.error("Get feedback error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch feedback."
        });
    }
};


// Submit feedback
exports.createFeedback = async (req, res) => {
    try {
        const {
            user_id,
            rating,
            comment
        } = req.body;

        const complaintId =
            req.params.complaintId;


        if (!user_id || !rating) {
            return res.status(400).json({
                success: false,
                message: "User and rating are required."
            });
        }


        if (
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5."
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


        if (complaint.status !== "Closed") {
            return res.status(400).json({
                success: false,
                message:
                    "Feedback can only be submitted after a complaint is closed."
            });
        }


        // Make sure feedback belongs to complaint user
        if (
            Number(user_id) !==
            Number(complaint.user_id)
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the complaint owner can submit feedback."
            });
        }


        // Check existing feedback
        const [existing] = await db.promise().query(
            "SELECT feedback_id FROM feedback WHERE complaint_id = ?",
            [complaintId]
        );


        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Feedback has already been submitted for this complaint."
            });
        }


        // Insert feedback
        await db.promise().query(`
            INSERT INTO feedback
            (
                complaint_id,
                user_id,
                rating,
                comment
            )
            VALUES (?, ?, ?, ?)
        `, [
            complaintId,
            user_id,
            rating,
            comment?.trim() || null
        ]);


        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully."
        });


    } catch (error) {
        console.error("Create feedback error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to submit feedback."
        });
    }
};