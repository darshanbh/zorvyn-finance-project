const Transaction = require("../models/Transaction");
 
// ── OVERALL SUMMARY ───────────────────────────────────────────────────────────
// GET /api/dashboard/summary
// Returns: { totalIncome, totalExpenses, netBalance, totalRecords }
const getSummary = async (req, res) => {
  try {
    // Aggregation Pipeline:
    // Stage 1: $match  → only non-deleted records
    // Stage 2: $group  → group ALL records together (null = no grouping key)
    //                    compute separate sums for income and expense
    const result = await Transaction.aggregate([
      {
        // Stage 1: Filter out deleted records (like WHERE isDeleted = false)
        $match: { isDeleted: false },
      },
      {
        // Stage 2: Group all records into one summary document
        $group: {
          _id: null, // null means "group everything together"
 
          // $cond: if condition → valueIfTrue, else valueIfFalse
          // $sum adds up only income amounts, and only expense amounts
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
          totalRecords: { $sum: 1 }, // count total records
        },
      },
    ]);
 
    // If no transactions exist yet, result will be an empty array
    if (result.length === 0) {
      return res.json({ totalIncome: 0, totalExpenses: 0, netBalance: 0, totalRecords: 0 });
    }
 
    const { totalIncome, totalExpenses, totalRecords } = result[0];
 
    res.json({
      totalIncome,
      totalExpenses,
      netBalance:   totalIncome - totalExpenses,
      totalRecords,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Could not fetch summary.", error: error.message });
  }
};
 
// ── CATEGORY-WISE BREAKDOWN ───────────────────────────────────────────────────
// GET /api/dashboard/category-summary
// Returns total amount per category per type (income/expense)
// Useful for: pie charts, bar charts
const getCategorySummary = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        // Group by BOTH category AND type together
        // e.g. { category: "food", type: "expense", total: 5000, count: 12 }
        $group: {
          _id: {
            category: "$category",
            type:     "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        // Sort by total amount (highest first)
        $sort: { total: -1 },
      },
    ]);
 
    // Reshape the output to be cleaner (flatten the _id object)
    const formatted = result.map((item) => ({
      category: item._id.category,
      type:     item._id.type,
      total:    item.total,
      count:    item.count,
    }));
 
    res.json({ categorySummary: formatted });
 
  } catch (error) {
    res.status(500).json({ message: "Could not fetch category summary.", error: error.message });
  }
};
 
// ── MONTHLY TRENDS ────────────────────────────────────────────────────────────
// GET /api/dashboard/monthly-trends
// Returns month-by-month income and expense totals for last 12 months
// Useful for: line charts, bar charts showing trends over time
const getMonthlyTrends = async (req, res) => {
  try {
    // Calculate date 12 months ago from today
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
 
    const result = await Transaction.aggregate([
      {
        // Only records from last 12 months, not deleted
        $match: {
          isDeleted: false,
          date: { $gte: twelveMonthsAgo },
        },
      },
      {
        // Group by year + month + type
        // $year and $month extract year/month from the date field
        $group: {
          _id: {
            year:  { $year:  "$date" },
            month: { $month: "$date" },
            type:  "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        // Sort chronologically (oldest to newest)
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
 
    // Flatten output
    const formatted = result.map((item) => ({
      year:  item._id.year,
      month: item._id.month,
      type:  item._id.type,
      total: item.total,
    }));
 
    res.json({ monthlyTrends: formatted });
 
  } catch (error) {
    res.status(500).json({ message: "Could not fetch monthly trends.", error: error.message });
  }
};
 
// ── RECENT ACTIVITY ───────────────────────────────────────────────────────────
// GET /api/dashboard/recent-activity
// Returns last 10 transactions — like an "activity feed"
const getRecentActivity = async (req, res) => {
  try {
    const recent = await Transaction.find({ isDeleted: false })
      .populate("createdBy", "name email")  // show who created each record
      .sort({ createdAt: -1 })              // newest first
      .limit(10);
 
    res.json({ recentActivity: recent });
 
  } catch (error) {
    res.status(500).json({ message: "Could not fetch recent activity.", error: error.message });
  }
};
 
module.exports = { getSummary, getCategorySummary, getMonthlyTrends, getRecentActivity };