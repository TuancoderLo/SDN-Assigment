// Simple server test
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// MongoDB connection test
app.get("/db-test", async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    res.json({
      message: "Database is working!",
      collections: collections.map((c) => c.name),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
