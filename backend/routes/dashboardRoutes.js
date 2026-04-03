const express = require("express");
const router  = express.Router();

const {
  getSummary,
  getCategorySummary,
  getMonthlyTrends,
  getRecentActivity,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/summary",          getSummary);
router.get("/category-summary", getCategorySummary);
router.get("/monthly-trends",   getMonthlyTrends);
router.get("/recent-activity",  getRecentActivity);

module.exports = router;