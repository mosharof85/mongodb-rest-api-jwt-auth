import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//@desc     Auth user and set token
//@API      POST /api/users/auth
//@access   Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc     Register user
//@API      POST /api/users
//@access   Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await userModel.findOne({
    email,
  });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await userModel.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc     Logout user
//@API      POST /api/users/logout
//@access   Public

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "User logged out",
  });
});

//@desc     Get user profile
//@API      GET /api/users/profile
//@access   Private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(user);
});

//@desc     Update user profile
//@API      GET /api/users/profile
//@access   Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updateduser = await user.save();

    res.status(200).json({
      _id: updateduser._id,
      name: updateduser.name,
      email: updateduser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    message: "Update user profile",
  });
});
export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
