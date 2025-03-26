require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000, // Increase timeout
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
