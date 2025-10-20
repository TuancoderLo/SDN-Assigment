const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Use express-ejs-layouts
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Static files
app.use(express.static("public"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    success: true,
    server: "running",
    database: dbStates[dbStatus] || "unknown",
    timestamp: new Date().toISOString(),
  });
});

// UI Routes
app.use("/", require("./routes/uiRoutes"));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/brands", require("./routes/brandRoutes"));
app.use("/api/perfumes", require("./routes/perfumeRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/collectors", require("./routes/collectorRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
