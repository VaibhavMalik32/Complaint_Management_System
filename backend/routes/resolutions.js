const express = require("express");

const router = express.Router();

const {
    getResolution,
    createResolution,
    closeComplaint
} = require("../controllers/resolutionController");


router.get(
    "/complaints/:complaintId",
    getResolution
);


router.post(
    "/complaints/:complaintId",
    createResolution
);


router.put(
    "/complaints/:complaintId/close",
    closeComplaint
);


module.exports = router;