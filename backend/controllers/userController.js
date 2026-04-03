 
const User = require("../models/User");
 
// ── GET ALL USERS ─────────────────────────────────────────────────────────────
// GET /api/users
// Returns list of all users (passwords excluded)
const getAllUsers = async (req, res) => {
  try {
    // .select("-password") → return all fields EXCEPT password
    const users = await User.find().select("-password");
 
    res.json({
      total: users.length,
      users,
    });
 
  } catch (error) {
    res.status(500).json({ message: "Could not fetch users.", error: error.message });
  }
};
 
// ── UPDATE USER ───────────────────────────────────────────────────────────────
// PATCH /api/users/:id
// Body: { name?, role?, status? }  ← any or all of these
// Admin can change someone's role (e.g. viewer → analyst)
// or deactivate an account (status: "inactive")
const updateUser = async (req, res) => {
  // Only allow updating these specific fields (ignore anything else in body)
  const { name, role, status } = req.body;
 
  // Build an update object with only the fields that were provided
  // This avoids accidentally overwriting fields with undefined
  const updates = {};
  if (name)   updates.name   = name;
  if (role)   updates.role   = role;
  if (status) updates.status = status;
 
  try {
    // findByIdAndUpdate(id, changes, options)
    // { new: true }           → return the UPDATED document (not old one)
    // { runValidators: true } → run schema validation (e.g. check valid role value)
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,   // :id from the URL
      updates,
      { new: true, runValidators: true }
    ).select("-password");
 
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
 
    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
 
  } catch (error) {
    // If invalid role/status value provided, Mongoose throws a validation error
    res.status(400).json({ message: "Update failed.", error: error.message });
  }
};
 
// ── DELETE USER ───────────────────────────────────────────────────────────────
// DELETE /api/users/:id
// Permanently removes the user from database
// NOTE: In production you'd usually soft-delete users too, but for simplicity we hard delete here
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
 
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
 
    res.json({ message: `User '${user.name}' deleted successfully.` });
 
  } catch (error) {
    res.status(500).json({ message: "Delete failed.", error: error.message });
  }
};
 
module.exports = { getAllUsers, updateUser, deleteUser };