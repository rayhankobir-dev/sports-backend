import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { tokenConfig } from "../config.js";
import ApiError from "../helpers/ApiError.js";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { Genre } from "../models/genre.model.js";
import { Video } from "../models/video.model.js";
import { Rating } from "../models/rating.model.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import {
  calculateTotalWatchTimeByOwner,
  coachPopularVideo,
  countPublishedCategoriesByOwner,
  countWatchedUsers,
  getGenreVideoCount,
  getVideCount,
  getVideCountByOwner,
  topWatchedVideos,
} from "./video.controller.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
  if (!user) throw new ApiError(404, "User not registered");

  const isCorrectPassword = await user.isPasswordCorrect(password);
  if (!isCorrectPassword) throw new ApiError(400, "Invalid credentials");

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

// create admin controller
export const createUser = async (req, res) => {
  const { fullName, email, password, avatar, role } = req.body;
  try {
    const user = await User.findOne({ email });
    const existRole = await Role.findOne({ role });

    if (user)
      return res.status(400).json(new ApiResponse(400, "User already exists"));
    if (!existRole)
      return res.status(400).json(new ApiResponse(400, "Role doesn't exists"));

    const { url } = await uploadOnCloudinary(avatar.path);

    const newUser = await User.create({
      fullName,
      email,
      password,
      avatar: url,
      role: existRole._id,
    });

    return res.status(201).json(
      new ApiResponse(201, `${role} created successfully`, {
        user: newUser,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
};

// get all player controller
export const getAllPlayers = asyncHandler(async (req, res) => {
  const role = await Role.findOne({ role: "player" });
  const users = await User.find({ role }).populate("role");
  return res.status(200).json({
    success: true,
    message: "Success",
    data: users,
  });
});

// get all coach controller
export const getAllCoach = asyncHandler(async (req, res) => {
  const role = await Role.findOne({ role: "coach" });
  const users = await User.find({ role }).populate("role");
  return res.status(200).json({
    success: true,
    message: "Success",
    data: users,
  });
});

// get all admin controller
export const getAllAdmin = asyncHandler(async (req, res) => {
  const role = await Role.findOne({ role: "admin" });
  const users = await User.find({ role }).populate("role");
  return res.status(200).json({
    success: true,
    message: "Success",
    data: users,
  });
});

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

// getting user profile
export const userProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -refreshToken")
      .populate("role genre watchHistory");
    return res.status(200).json(new ApiResponse(200, "Success", { user }));
  } catch (error) {
    throw error;
  }
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const { avatar } = req.body;
  try {
    const { url } = await uploadOnCloudinary(avatar.path);
    await User.updateOne({ _id: req.user._id }, { avatar: url });
    return res
      .status(200)
      .json(new ApiResponse(200, "Avatar successfully updated"));
  } catch (error) {
    throw error;
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { user } = req.body;
  try {
    const userExist = User.findById(user);
    if (!userExist) throw new ApiError(400, "User not found");

    await User.findByIdAndDelete(user);
    await Video.deleteMany({ owner: user });

    res.status(200).json(new ApiResponse(200, "User deleted successfully"));
  } catch (error) {
    throw error;
  }
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, genre, height, weight, country } = req.body;
  try {
    const existGenre = await Genre.findById(genre);
    if (!existGenre) throw new ApiError(400, "Invalid genre");
    await User.findByIdAndUpdate(req.user._id, {
      fullName,
      genre,
      weight,
      height,
      country,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Profile successfully updated"));
  } catch (error) {
    throw error;
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const isMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isMatched) throw new ApiError(400, "Inccorect current password");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, {
      password: hashedPassword,
    });

    return res.status(200).json(new ApiResponse(200, "Password is updated"));
  } catch (error) {
    throw error;
  }
});

export const addWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const watched = user.watchHistory?.some(
      (watch) => watch?._id.toString() === videoId
    );
    const video = await Video.findById(videoId);
    if (!watched) {
      user.watchHistory.push(video);
      user.save();
    }

    res.status(200).json(new ApiResponse(200, "Success"));
  } catch (error) {
    throw error;
  }
});

// getting all playlists
export const getPlaylists = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("playlist");
    res.status(200).json(
      new ApiResponse(200, "Success", {
        playlists: user.playlist,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

// add video into a playlist
export const addPlaylistItem = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(400, "Video not found");

    const user = await User.findById(req.user._id).populate("playlist");
    const watched = user.playlist?.some(
      (watch) => watch?._id.toString() === videoId
    );
    if (watched) throw new ApiError(400, "Video already in playlist");

    user.playlist.push(video);
    user.save();

    res.status(200).json(
      new ApiResponse(200, "Video is added to playlist", {
        playlists: user.playlist,
      })
    );
  } catch (error) {
    throw error;
  }
});

// remove video from a playlist
export const removePlaylistItem = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  try {
    const user = await User.findById(req.user._id).populate("playlist");
    const exist = user.playlist.some((item) => item._id.toString() === videoId);
    if (!exist) throw new ApiError(404, "Playlist item not found");

    user.playlist = user.playlist.filter(
      (item) => item._id.toString() !== videoId
    );
    user.save();

    res.status(200).json(
      new ApiResponse(200, "Successfully removed from playlist", {
        playlists: user.playlist,
      })
    );
  } catch (error) {
    throw error;
  }
});

// admin analytics
export const adminAnalytics = asyncHandler(async (req, res) => {
  try {
    const geoData = await getGeoData();
    const pieData = await getGenreVideoCount();
    const userCount = await getTotalUser();
    const videoInfo = await getVideCount();
    const topVideos = await topWatchedVideos();

    const analytics = {
      geoData,
      pieData,
      userCount,
      videoInfo,
      topVideos,
    };

    res.status(200).json(
      new ApiResponse(200, "Success", {
        analytics,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const coachAnalytics = asyncHandler(async (req, res) => {
  try {
    const geoData = await getWatchedUsersGeoData();
    const pieData = await getGenreVideoCount();
    const userCount = await getTotalUser();
    const videoInfo = await getVideCountByOwner(req.user._id);
    const topVideos = await coachPopularVideo(req.user._id);
    const watchedUser = await countWatchedUsers(req.user._id);
    const genreCount = await countPublishedCategoriesByOwner(req.user._id);
    const watchTime = await calculateTotalWatchTimeByOwner(req.user._id);

    const analytics = {
      topVideos,
      geoData,
      pieData,
      userCount,
      videoInfo,
      watchedUser,
      genreCount,
      watchTime,
    };

    res.status(200).json(
      new ApiResponse(200, "Success", {
        analytics,
      })
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
});

// getting user geo data
const getGeoData = async () => {
  const role = await Role.findOne({ role: "player" });
  const result = await User.aggregate([
    {
      $match: { country: { $ne: null }, role: role._id },
    },
    { $group: { _id: "$country", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const formattedResult = [
    ["Country", "Players"],
    ...result.map((item) => [item._id, item.count]),
  ];

  return formattedResult;
};

const getWatchedUsersGeoData = async (ownerId) => {
  try {
    const result = await User.aggregate([
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchedVideos",
        },
      },
      {
        $match: {
          country: { $ne: null },
          watchedVideos: { $exists: true, $not: { $size: 0 } },
        },
      },
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const formattedResult = [
      ["Country", "Players"],
      ...result.map((item) => [item._id, item.count]),
    ];

    return formattedResult;
  } catch (error) {
    throw error;
  }
};

// getting user count
const getTotalUser = async () => {
  try {
    const result = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "roles",
          localField: "_id",
          foreignField: "_id",
          as: "roleInfo",
        },
      },
      { $unwind: "$roleInfo" },
      {
        $project: {
          _id: "$_id",
          role: "$roleInfo.role",
          count: 1,
        },
      },
    ]);

    const formattedResult = {};
    result.forEach((item) => {
      formattedResult[item.role] = { count: item.count };
    });
    return formattedResult;
  } catch (error) {
    throw error;
  }
};

// getting practicelist of a user
export const getPracticeList = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json(
      new ApiResponse(200, "Success", {
        practiceList: user.practiceList,
      })
    );
  } catch (error) {
    throw error;
  }
});

// getting rated videos which rate by a user
export const getRatedVideos = asyncHandler(async (req, res) => {
  try {
    const videos = await Rating.find({ user: req.user._id });
    res.status(200).json(
      new ApiResponse(200, "Success", {
        videos,
      })
    );
  } catch (error) {
    throw error;
  }
});
