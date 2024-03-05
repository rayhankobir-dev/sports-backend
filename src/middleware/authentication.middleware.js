import jwt from "jsonwebtoken";
import ApiError from "../helpers/ApiError.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { tokenConfig } from "../config.js";
import { User } from "../models/user.model.js";

export const auth = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      res.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) throw new ApiError(401, "Unauthorized request");
    const payload = jwt.decode(accessToken, tokenConfig.accessTokenSecret);
    if (!payload) throw new ApiError(401, "Invalid Access token");

    const user = await User.findById(payload?._id)
      .select("-password -refreshToken")
      .populate("role");
    if (!user) throw new ApiError(401, "Invalid Access Token");
    req.user = user;
    next();
  } catch (error) {
    throw error;
  }
});

// export const verifyJWT = asyncHandler(async (req, _, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     // console.log(token);
//     if (!token) {
//       throw new ApiError(401, "Unauthorized request");
//     }

//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decodedToken?._id).select(
//       "-password -refreshToken"
//     );

//     if (!user) {
//       throw new ApiError(401, "Invalid Access Token");
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid access token");
//   }
// });
