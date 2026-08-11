const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const companyDashboardRoutes = require("./routes/companyDashboardRoutes");
const schedulingRoutes = require("./routes/schedulingRoutes");
const messageRoutes = require("./routes/messageRoutes");
const serviceCatalogRoutes = require("./routes/serviceCatalogRoutes");
const staffRoutes = require("./routes/staffRoutes");

const { uploadImage, UPLOAD_DIR } = require("./controllers/uploadController");
const { authenticate, authorize } = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Uploaded catalogue images. Read is public; writing needs an admin.
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "1d" }));
app.post("/api/uploads", authenticate, authorize("ADMIN"), uploadImage);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/company-dashboard", companyDashboardRoutes);
app.use("/api/scheduling", schedulingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/catalog", serviceCatalogRoutes);
app.use("/api/staff", staffRoutes);

module.exports = app;
