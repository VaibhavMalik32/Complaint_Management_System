const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");
const organizationRoutes = require("./routes/organizations");
const departmentRoutes = require("./routes/departments");
const categoryRoutes = require("./routes/categories");
const complaintRoutes = require("./routes/complaints");
const userRoutes = require("./routes/users");
const staffRoutes = require("./routes/staff");
const managementRoutes = require("./routes/management");
const resolutionRoutes = require("./routes/resolutions");
const feedbackRoutes = require("./routes/feedback");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/organizations", organizationRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/management", managementRoutes);
app.use("/api/resolutions", resolutionRoutes);
app.use("/api/feedback", feedbackRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Unified Complaint Management System is running!",
        status: "success"
    });
});

app.get("/organizations", (req, res) => {
    res.sendFile(__dirname + "/views/organization.html");
});
app.get("/departments-categories", (req, res) => {
    res.sendFile(__dirname + "/views/departments-categories.html");
});
app.get("/complaints", (req, res) => {
    res.sendFile(__dirname + "/views/complaints.html");
});
app.get("/staff", (req, res) => {
    res.sendFile(__dirname + "/views/staff.html");
});
app.get("/management", (req, res) => {
    res.sendFile(__dirname + "/views/management.html");
});
app.get("/resolution-feedback", (req, res) => {
    res.sendFile(
        __dirname + "/views/resolution-feedback.html"
    );
});
db.query("SELECT 1 AS test", (err) => {
    if (err) {
        console.error("Database connection failed:");
        console.error(err.message);
        return;
    }

    console.log("MySQL database connected successfully!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});