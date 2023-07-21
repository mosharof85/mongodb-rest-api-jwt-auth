import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await userModel.findById(decoded.userID).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

export { protect };
