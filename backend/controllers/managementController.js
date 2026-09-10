const db = require("../config/database");


// Get complaints for management dashboard
exports.getManagedComplaints = async (req, res) => {
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

                cat.name AS category_name,

                s.staff_id,
                su.name AS staff_name,
                s.designation

            FROM complaints c

            JOIN users u
                ON c.user_id = u.user_id

            JOIN organizations o
                ON c.organization_id = o.organization_id

            JOIN categories cat
                ON c.category_id = cat.category_id

            LEFT JOIN assignments a
                ON c.complaint_id = a.complaint_id

            LEFT JOIN staff s
                ON a.staff_id = s.staff_id

            LEFT JOIN users su
                ON s.user_id = su.user_id

            ORDER BY c.created_at DESC
        `);


        res.json({
            success: true,
            complaints
        });

    } catch (error) {

        console.error(
            "Get managed complaints error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch complaints."
        });
    }
};



// Get staff available for assignment
exports.getAssignmentStaff = async (req, res) => {
    try {

        const [staff] = await db.promise().query(`
            SELECT
                s.staff_id,
                s.user_id,
                s.designation,
                u.name AS staff_name,
                d.name AS department_name,
                o.name AS organization_name
            FROM staff s

            JOIN users u
                ON s.user_id = u.user_id

            JOIN departments d
                ON s.department_id = d.department_id

            JOIN organizations o
                ON d.organization_id = o.organization_id

            ORDER BY u.name
        `);


        res.json({
            success: true,
            staff
        });

    } catch (error) {

        console.error(
            "Get assignment staff error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch staff."
        });
    }
};



// Assign complaint to staff
exports.assignComplaint = async (req, res) => {

    try {

        const {
            staff_id
        } = req.body;


        if (!staff_id) {

            return res.status(400).json({
                success: false,
                message: "Staff member is required."
            });
        }


        // Get complaint
        const [complaints] =
            await db.promise().query(
                `SELECT
                    complaint_id,
                    user_id,
                    status
                 FROM complaints
                 WHERE complaint_id = ?`,
                [req.params.id]
            );


        if (complaints.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }


        const complaint =
            complaints[0];


        // Check staff
        const [staff] =
            await db.promise().query(
                `SELECT
                    staff_id,
                    user_id
                 FROM staff
                 WHERE staff_id = ?`,
                [staff_id]
            );


        if (staff.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Staff member not found."
            });
        }


        // Check existing assignment
        const [existing] =
            await db.promise().query(
                `SELECT assignment_id
                 FROM assignments
                 WHERE complaint_id = ?`,
                [req.params.id]
            );


        if (existing.length > 0) {

            await db.promise().query(
                `UPDATE assignments
                 SET staff_id = ?,
                     assigned_at = CURRENT_TIMESTAMP
                 WHERE complaint_id = ?`,
                [
                    staff_id,
                    req.params.id
                ]
            );

        } else {

            await db.promise().query(
                `INSERT INTO assignments
                (
                    complaint_id,
                    staff_id,
                    assigned_by
                )
                VALUES (?, ?, NULL)`,
                [
                    req.params.id,
                    staff_id
                ]
            );
        }


        // Change status to Assigned
        const oldStatus =
            complaint.status;


        if (
            oldStatus !== "Assigned" &&
            oldStatus !== "Resolved" &&
            oldStatus !== "Closed"
        ) {

            await db.promise().query(
                `UPDATE complaints
                 SET status = 'Assigned'
                 WHERE complaint_id = ?`,
                [req.params.id]
            );


            // Use assigned staff as updater
            await db.promise().query(
                `INSERT INTO complaint_updates
                (
                    complaint_id,
                    updated_by,
                    old_status,
                    new_status,
                    remarks
                )
                VALUES (?, ?, ?, ?, ?)`,
                [
                    req.params.id,
                    staff[0].user_id,
                    oldStatus,
                    "Assigned",
                    "Complaint assigned to staff member."
                ]
            );


            await db.promise().query(
                `INSERT INTO notifications
                (
                    user_id,
                    complaint_id,
                    message
                )
                VALUES (?, ?, ?)`,
                [
                    complaint.user_id,
                    req.params.id,
                    `Complaint #${req.params.id} has been assigned to a staff member.`
                ]
            );
        }


        res.json({
            success: true,
            message: "Complaint assigned successfully."
        });


    } catch (error) {

        console.error(
            "Assign complaint error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to assign complaint."
        });
    }
};



// Change complaint status
exports.updateComplaintStatus = async (req, res) => {

    try {

        const {
            status,
            remarks
        } = req.body;


        const allowedStatuses = [
            "Submitted",
            "Under Review",
            "Assigned",
            "In Progress",
            "Resolved",
            "Closed",
            "Rejected"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid complaint status."
            });
        }


        // Get complaint
        const [complaints] =
            await db.promise().query(
                `SELECT
                    complaint_id,
                    user_id,
                    status
                 FROM complaints
                 WHERE complaint_id = ?`,
                [req.params.id]
            );


        if (complaints.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }


        const complaint =
            complaints[0];


        const oldStatus =
            complaint.status;


        if (oldStatus === status) {

            return res.json({
                success: true,
                message: "Complaint is already in this status."
            });
        }


        // Find assigned staff
        const [assignments] =
            await db.promise().query(
                `SELECT
                    s.user_id
                 FROM assignments a
                 JOIN staff s
                    ON a.staff_id = s.staff_id
                 WHERE a.complaint_id = ?
                 LIMIT 1`,
                [req.params.id]
            );


        let updatedBy =
            complaint.user_id;


        if (assignments.length > 0) {
            updatedBy =
                assignments[0].user_id;
        }


        // Update complaint
        await db.promise().query(
            `UPDATE complaints
             SET status = ?
             WHERE complaint_id = ?`,
            [
                status,
                req.params.id
            ]
        );


        // Record history
        await db.promise().query(
            `INSERT INTO complaint_updates
            (
                complaint_id,
                updated_by,
                old_status,
                new_status,
                remarks
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                req.params.id,
                updatedBy,
                oldStatus,
                status,
                remarks?.trim() || null
            ]
        );


        // Notify user
        await db.promise().query(
            `INSERT INTO notifications
            (
                user_id,
                complaint_id,
                message
            )
            VALUES (?, ?, ?)`,
            [
                complaint.user_id,
                req.params.id,
                `Complaint #${req.params.id} status changed from "${oldStatus}" to "${status}".`
            ]
        );


        res.json({
            success: true,
            message: "Complaint status updated successfully."
        });


    } catch (error) {

        console.error(
            "Update complaint status error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update complaint status."
        });
    }
};



// Get complaint history
exports.getComplaintHistory = async (req, res) => {

    try {

        const [updates] =
            await db.promise().query(
                `SELECT
                    cu.update_id,
                    cu.old_status,
                    cu.new_status,
                    cu.remarks,
                    cu.updated_at,
                    u.name AS updated_by_name

                 FROM complaint_updates cu

                 JOIN users u
                    ON cu.updated_by = u.user_id

                 WHERE cu.complaint_id = ?

                 ORDER BY cu.updated_at ASC`,
                [req.params.id]
            );


        res.json({
            success: true,
            updates
        });

    } catch (error) {

        console.error(
            "Get complaint history error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch complaint history."
        });
    }
};