/*
 * config/db.js — DATABASE CONNECTION
 *
 * This file has ONE job: connect to MongoDB.
 * We keep it separate so server.js stays clean.
 *
 * mongoose.connect() returns a Promise, so we use async/await.
 * If connection fails → print error and stop the app (process.exit(1)).
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // process.env.MONGO_URI comes from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // Exit the process with failure code 1
    // (so the server doesn't run without a database)
    process.exit(1);
  }
};

module.exports = connectDB;