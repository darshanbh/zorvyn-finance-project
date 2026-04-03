const express  = require("express");
const router   = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
 
// Public routes (no token needed)
router.post("/register", register);
router.post("/login",    login);
 
// Protected route (token required)
// protect runs first → if valid, calls next() → getMe runs
router.get("/me", protect, getMe);
 
module.exports = router;