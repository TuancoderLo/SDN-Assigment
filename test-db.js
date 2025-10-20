// Simple test script to check MongoDB connection and data
const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
  try {
    console.log("🔄 Testing MongoDB connection...");
    console.log("Connection string:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connected successfully!");

    // Test if collections exist
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "📋 Available collections:",
      collections.map((c) => c.name)
    );

    // Test perfumes collection
    const Perfume = mongoose.model(
      "Perfume",
      new mongoose.Schema({}, { strict: false })
    );
    const count = await Perfume.countDocuments();
    console.log(`🧴 Found ${count} perfumes in database`);

    if (count > 0) {
      const sample = await Perfume.findOne().lean();
      console.log("📄 Sample perfume:", JSON.stringify(sample, null, 2));
    }

    mongoose.disconnect();
    console.log("✅ Test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Full error:", error);
  }
}

testConnection();
