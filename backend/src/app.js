const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/contact", contactRoutes);

module.exports = app;




