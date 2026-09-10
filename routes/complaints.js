const express = require("express");

const router = express.Router();

const {
    getComplaints,
    getComplaint,
    createComplaint
} = require("../controllers/complaintController");


router.get("/", getComplaints);

router.get("/:id", getComplaint);

router.post("/", createComplaint);


module.exports = router;