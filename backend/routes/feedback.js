const express = require("express");

const router = express.Router();

const {
    getFeedback,
    createFeedback
} = require("../controllers/feedbackController");


router.get(
    "/complaints/:complaintId",
    getFeedback
);


router.post(
    "/complaints/:complaintId",
    createFeedback
);


module.exports = router;