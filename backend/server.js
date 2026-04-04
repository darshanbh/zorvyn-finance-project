const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Step 1: Load .env file FIRST before anything else
dotenv.config();

// Step 2: Connect to MongoDB
connectDB();

// Step 3: Create the Express app
const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth",         require("./routes/authRoutes"));
app.use("/api/users",        require("./routes/userRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/dashboard",    require("./routes/dashboardRoutes"));

// ── 404 Handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── Global Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

app.get("/", (req, res) => {
  res.send("Zorvyn Finance Backend System API is running 🚀");
});

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});