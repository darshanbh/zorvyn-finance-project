const mongoose = require("mongoose");
 
const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
 
    // "income" = money coming in, "expense" = money going out
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Type (income/expense) is required"],
    },
 
    // Category helps group transactions for analytics (charts, summaries)
    category: {
      type: String,
      enum: [
        "salary",
        "freelance",
        "investment",
        "food",
        "rent",
        "transport",
        "health",
        "entertainment",
        "education",
        "other",
      ],
      required: [true, "Category is required"],
    },
 
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
 
    notes: {
      type: String,
      trim: true,
      default: "",
    },
 
    // ref: "User" creates a relationship — this stores a User's _id
    // We can later use .populate("createdBy") to get the full user object
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
 
    // Soft delete flag — true means this record is "deleted" (but still in DB)
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // auto-adds createdAt + updatedAt
  }
);
 
module.exports = mongoose.model("Transaction", transactionSchema);