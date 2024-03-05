import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import asyncHandler from "../helpers/asyncHandler.js";
import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import { tokenConfig } from "../config.js";

// generating access and refresh token
export const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong!");
  }
};

// login controller
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiResponse(200, "User not registered");

  const isCorrectPassword = await user.isPasswordCorrect(password);
  if (!isCorrectPassword) throw new ApiResponse(400, "Invalid credentials");

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("role");

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "Login successful",
      user: loggedInUser,
      accessToken,
      refreshToken,
    });
});

// creating new user
export const signupUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const defaultRole = await Role.findOne({ role: "player" });
  if (!defaultRole) {
    return res.status(500).json({
      success: false,
      message: "User role not found",
    });
  }

  const newUser = await User.create({
    fullName,
    email,
    password,
    role: defaultRole,
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const payload = jwt.verify(
      incomingRefreshToken,
      tokenConfig.refreshTokenSecret
    );

    const user = await User.findById(payload?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "Access token refreshed", {
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});
// create coach controller
export const createCoachController = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "coach",
  });

  return res.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: newUser,
  });
};

// create player controller
export const createPlayerController = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "player",
  });

  return res.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: newUser,
  });
};

// create admin controller
export const createAdminController = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  return res.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: newUser,
  });
};

// get all player controller
export const getAllPlayerController = async (req, res) => {
  const users = await User.find({ role: "player" });
  return res.status(200).json({
    success: true,
    message: "All players",
    data: users,
  });
};

// get all coach controller
export const getAllCoachController = async (req, res) => {
  const users = await User.find({ role: "coach" });
  return res.status(200).json({
    success: true,
    message: "All coaches",
    data: users,
  });
};

// get all admin controller
export const getAllAdminController = async (req, res) => {
  const users = await User.find({ role: "admin" });
  return res.status(200).json({
    success: true,
    message: "All admins",
    data: users,
  });
};

// get user by their email controller
export const getUserByEmailController = async (req, res) => {
  const { email } = req.params;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "User found",
    data: user,
  });
};

// update user by their email controller
export const updateUserByEmailController = async (req, res) => {
  const { email } = req.params;
  const { name, password } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  if (name) {
    user.name = name;
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "User successfully updated",
    data: user,
  });
};
