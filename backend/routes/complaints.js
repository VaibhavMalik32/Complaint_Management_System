const express = require("express");

const router = express.Router();

const {
    getComplaints,
    getComplaint,
    createComplaint,
    getUserComplaints
} = require("../controllers/complaintController");


router.get("/", getComplaints);

router.get("/user/:userId", getUserComplaints);

router.get("/:id", getComplaint);

router.post("/", createComplaint);


module.exports = router;