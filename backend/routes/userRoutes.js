
const express  = require("express");
const router   = express.Router();
const { getAllUsers, updateUser, deleteUser } = require("../controllers/userController");
const { protect }   = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
 
// Apply protect + authorize("admin") to ALL routes in this file
// Any request to /api/users/* must be from a logged-in admin
router.use(protect, authorize("admin"));
 
router.get("/",        getAllUsers);
router.patch("/:id",   updateUser);
router.delete("/:id",  deleteUser);
 
module.exports = router;
 