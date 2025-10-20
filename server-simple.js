const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Connect to MongoDB
async function connectDB() {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ MongoDB Connected Successfully");
    } else {
      console.log("⚠️ No MONGO_URI found, running without database");
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log("⚠️ Continuing without database connection");
  }
}

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

// Simple test route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working!",
    timestamp: new Date().toISOString(),
  });
});

// Health check without database
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    server: "running",
    database: "not connected",
    timestamp: new Date().toISOString(),
  });
});

// Perfumes endpoint with real data
app.get("/api/perfumes", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return mock data if no database connection
      const mockPerfumes = [
        {
          _id: "1",
          name: "Mock Perfume 1",
          price: 100,
          size: 100,
          brand: { _id: "1", name: "Mock Brand" },
          description: "Mock description - No database connection",
        },
        {
          _id: "2",
          name: "Mock Perfume 2",
          price: 150,
          size: 75,
          brand: { _id: "2", name: "Another Mock Brand" },
          description: "Another mock description - No database connection",
        },
      ];

      return res.json({
        success: true,
        count: mockPerfumes.length,
        data: {
          perfumes: mockPerfumes,
          pagination: {
            page: 1,
            pages: 1,
            total: mockPerfumes.length,
            limit: 10,
          },
        },
      });
    }

    // Real database query
    const Perfume = require("./models/Perfume");
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    const total = await Perfume.countDocuments();
    const perfumes = await Perfume.find()
      .populate("brand", "brandName")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limitNum)
      .lean();

    // Transform data
    const transformedPerfumes = perfumes.map((perfume) => ({
      _id: perfume._id,
      name: perfume.perfumeName,
      description: perfume.description,
      price: perfume.price,
      size: perfume.volume,
      brand: perfume.brand
        ? {
            _id: perfume.brand._id,
            name: perfume.brand.brandName,
          }
        : null,
      targetAudience: perfume.targetAudience,
      concentration: perfume.concentration,
      ingredients: perfume.ingredients,
      createdAt: perfume.createdAt,
      updatedAt: perfume.updatedAt,
    }));

    const pagination = {
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
      limit: limitNum,
      hasNext: pageNum < Math.ceil(total / limitNum),
      hasPrev: pageNum > 1,
    };

    res.json({
      success: true,
      count: transformedPerfumes.length,
      data: {
        perfumes: transformedPerfumes,
        pagination,
      },
    });
  } catch (error) {
    console.error("Error in /api/perfumes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch perfumes: " + error.message,
    });
  }
});

// UI Routes
app.use("/", require("./routes/uiRoutes"));

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
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} in your browser`);
});
