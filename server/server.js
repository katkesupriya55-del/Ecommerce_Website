const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/shopeasy";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) =>
    console.error("MongoDB Connection Error:", err)
  );

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Shop Easy API Server Active"
  });
});

// Export for Vercel
module.exports = app;