import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader) {
    token = authHeader;
  }

  if (token) {
    try {
      const { userID } = jwt.verify(token, process.env.JWT_SECRET);

      if (userID.userID) {
        req.user = await userModel.findById(userID.userID).select("-password");
      } else {
        req.user = await userModel.findById(userID).select("-password");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized, Query Error");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

export { protect };
