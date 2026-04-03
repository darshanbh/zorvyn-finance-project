 
const express = require("express");
const router  = express.Router();
const {
  getTransactions,
  getOneTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { protect }   = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
 
// All transaction routes require login (any role)
router.use(protect);
 
// All 3 roles can VIEW transactions
router.get("/",    getTransactions);
router.get("/:id", getOneTransaction);
 
// Only analyst and admin can CREATE transactions
router.post("/", authorize("analyst", "admin"), createTransaction);
 
// Only analyst and admin can UPDATE (controller checks ownership for analysts)
router.patch("/:id", authorize("analyst", "admin"), updateTransaction);
 
// Only admin can DELETE (soft delete)
router.delete("/:id", authorize("admin"), deleteTransaction);
 
module.exports = router;