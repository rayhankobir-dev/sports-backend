import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/user.model.js";

// login controller
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({
      message: "Invalid password",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Login successful",
  });
};

// creating new user
export const signupController = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully",
  });
};

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
