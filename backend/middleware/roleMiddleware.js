const authorize = (...allowedRoles) => {
  // allowedRoles is an array, e.g. ["admin", "analyst"]
 
  // Return the actual middleware function
  return (req, res, next) => {
    // req.user was set by protect() middleware
    const userRole = req.user.role;
 
    // Check if the user's role is in the allowed list
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied. Your role '${userRole}' cannot perform this action. Allowed roles: ${allowedRoles.join(", ")}`,
      });
    }
 
    // Role is allowed → continue
    next();
  };
};
 
module.exports = { authorize };
 