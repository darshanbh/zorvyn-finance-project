const Transaction = require("../models/Transaction");
 
// ── GET ALL TRANSACTIONS ──────────────────────────────────────────────────────
// GET /api/transactions
// Query params (all optional):
//   ?type=income           → filter by income or expense
//   ?category=salary       → filter by category
//   ?startDate=2025-01-01  → records from this date
//   ?endDate=2025-12-31    → records up to this date
//   ?page=1&limit=10       → pagination (default: page 1, 20 per page)
const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 20 } = req.query;
 
    // Start with base filter: never show deleted records
    const filter = { isDeleted: false };
 
    // Dynamically add filters only if the query param was provided
    if (type)     filter.type     = type;
    if (category) filter.category = category;
 
    // Date range filter using MongoDB comparison operators
    // $gte = greater than or equal, $lte = less than or equal
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }
 
    // Pagination math:
    //  page=2, limit=10 → skip first 10 records, return next 10
    const skip = (Number(page) - 1) * Number(limit);
 
    // Count total matching records (for frontend to know total pages)
    const totalCount = await Transaction.countDocuments(filter);
 
    // Fetch the actual records
    const transactions = await Transaction.find(filter)
      .populate("createdBy", "name email role")  // replace ObjectId with user info
      .sort({ date: -1 })                         // newest first
      .skip(skip)
      .limit(Number(limit));
 
    res.json({
      total:        totalCount,
      page:         Number(page),
      totalPages:   Math.ceil(totalCount / Number(limit)),
      transactions,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Could not fetch transactions.", error: error.message });
  }
};
 
// ── GET ONE TRANSACTION ───────────────────────────────────────────────────────
// GET /api/transactions/:id
const getOneTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id:       req.params.id,
      isDeleted: false,
    }).populate("createdBy", "name email role");
 
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }
 
    res.json({ transaction });
 
  } catch (error) {
    // If :id is not a valid MongoDB ObjectId, mongoose throws CastError
    res.status(400).json({ message: "Invalid transaction ID.", error: error.message });
  }
};
 
// ── CREATE TRANSACTION ────────────────────────────────────────────────────────
// POST /api/transactions
// Body: { amount, type, category, date, notes? }
// Accessible to: analyst, admin
const createTransaction = async (req, res) => {
  const { amount, type, category, date, notes } = req.body;
 
  // Manual validation
  if (!amount || !type || !category || !date) {
    return res.status(400).json({
      message: "amount, type, category, and date are all required.",
    });
  }
 
  try {
    const transaction = await Transaction.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id,  // automatically set to logged-in user
    });
 
    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
 
  } catch (error) {
    // Mongoose validation errors (e.g. invalid category value)
    res.status(400).json({ message: "Could not create transaction.", error: error.message });
  }
};
 
// ── UPDATE TRANSACTION ────────────────────────────────────────────────────────
// PATCH /api/transactions/:id
// Body: { amount?, type?, category?, date?, notes? }
// Access rules:
//   analyst → can only edit records THEY created
//   admin   → can edit ANY record
const updateTransaction = async (req, res) => {
  try {
    // Find the record first (to check ownership before updating)
    const transaction = await Transaction.findOne({
      _id:       req.params.id,
      isDeleted: false,
    });
 
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }
 
    // Ownership check for analysts
    // .toString() needed because MongoDB ObjectIds aren't plain strings
    const isOwner = transaction.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
 
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You can only edit your own transactions.",
      });
    }
 
    // Only allow updating these fields (don't let user change createdBy, isDeleted, etc.)
    const allowedUpdates = ["amount", "type", "category", "date", "notes"];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
 
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
 
    res.json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
 
  } catch (error) {
    res.status(400).json({ message: "Update failed.", error: error.message });
  }
};
 
// ── DELETE TRANSACTION (Soft Delete) ─────────────────────────────────────────
// DELETE /api/transactions/:id
// Accessible to: admin only (enforced in route file)
// We set isDeleted: true instead of actually removing from DB
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id:       req.params.id,
      isDeleted: false,
    });
 
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }
 
    // Soft delete — just flip the flag
    transaction.isDeleted = true;
    await transaction.save();
 
    res.json({ message: "Transaction deleted successfully." });
 
  } catch (error) {
    res.status(500).json({ message: "Delete failed.", error: error.message });
  }
};
 
module.exports = {
  getTransactions,
  getOneTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};