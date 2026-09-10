const express = require("express");

const router = express.Router();

const {
    getManagedComplaints,
    getAssignmentStaff,
    assignComplaint,
    updateComplaintStatus,
    getComplaintHistory
} = require("../controllers/managementController");


router.get(
    "/complaints",
    getManagedComplaints
);


router.get(
    "/staff",
    getAssignmentStaff
);


router.post(
    "/complaints/:id/assign",
    assignComplaint
);


router.put(
    "/complaints/:id/status",
    updateComplaintStatus
);


router.get(
    "/complaints/:id/history",
    getComplaintHistory
);


module.exports = router;