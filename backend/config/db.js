require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Removed deprecated options
    });
    console.log("✅ MongoDB connection successful!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = {
  connectDB,
};
