import jwt from "jsonwebtoken";
import config from '../config/envConfig.js';
import User from "../models/User.js";

const authMiddleware = (role) => async (req, res, next) => {
  const token = req.header("Authorization");
  
  if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, config.SECRET_KEY_USER);
        const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    if (role && user.role !== role) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient privileges." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token. Authentication failed." });
  }
};

export default authMiddleware;
