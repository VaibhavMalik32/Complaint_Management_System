const express = require("express");

const router = express.Router();

const {
    getStaff,
    getAvailableUsers,
    createStaff,
    deleteStaff
} = require("../controllers/staffController");

router.get("/", getStaff);

router.get("/available-users", getAvailableUsers);

router.post("/", createStaff);

router.delete("/:id", deleteStaff);

module.exports = router;