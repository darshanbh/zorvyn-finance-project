 
const jwt  = require("jsonwebtoken");
const User = require("../models/User");
 
const protect = async (req, res, next) => {
  // Step 1: Check if Authorization header exists and starts with "Bearer"
  const authHeader = req.headers.authorization;
 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }
 
  // Step 2: Extract just the token part ("Bearer TOKEN" → "TOKEN")
  const token = authHeader.split(" ")[1];
 
  try {
    // Step 3: Verify the token using our secret key
    // If token is fake or expired, jwt.verify() throws an error → goes to catch
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: "user_id_here", iat: ..., exp: ... }
 
    // Step 4: Find the user in DB using the id from the token
    // .select("-password") means "give me everything EXCEPT the password field"
    const user = await User.findById(decoded.id).select("-password");
 
    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }
 
    // Step 5: Check if user account is active
    if (user.status === "inactive") {
      return res.status(403).json({ message: "Your account has been deactivated." });
    }
 
    // Step 6: Attach user to the request object
    // Now any controller after this middleware can access req.user
    req.user = user;
 
    // Step 7: Continue to the next middleware or controller
    next();
 
  } catch (error) {
    // jwt.verify() failed — token is invalid or expired
    return res.status(401).json({ message: "Token is invalid or expired. Please log in again." });
  }
};
 
module.exports = { protect };