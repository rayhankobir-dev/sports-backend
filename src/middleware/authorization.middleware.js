import ApiError from "../helpers/ApiError.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Role } from "../models/role.model.js";

const authorization = (allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    const user = req.user;
    const userRole = user.role;
    if (!user || !userRole) throw new ApiError("Unauthorized request");

    if (!allowedRoles.some((role) => userRole.role == role))
      throw new ApiError(401, "Permision denied");

    const roles = await Role.find().lean();
    if (!roles.some((role) => userRole._id.toString() === role._id.toString()))
      throw new ApiError(401, "Permission denied");

    next();
  });

export default authorization;
