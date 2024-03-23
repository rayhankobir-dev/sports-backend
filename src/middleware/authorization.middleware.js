import ApiError from "../helpers/ApiError.js";
import { Role } from "../models/role.model.js";
import asyncHandler from "../helpers/asyncHandler.js";

// check authorization and give access to perform the taks
const authorization = (allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    const user = req.user;
    const userRole = user.role;
    if (!user || !userRole) throw new ApiError("Unauthorized request");

    if (!allowedRoles.some((role) => userRole.role == role))
      throw new ApiError(403, "Permision denied");

    const roles = await Role.find().lean();
    if (!roles.some((role) => userRole._id.toString() === role._id.toString()))
      throw new ApiError(403, "Permission denied");

    next();
  });

export default authorization;
