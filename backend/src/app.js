const express = require("express");

const app = express();

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.json({ message: "Harmony backend is running" });
});

module.exports = app;