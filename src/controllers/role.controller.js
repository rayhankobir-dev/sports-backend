import ApiError from "../helpers/ApiError.js";
import { Role } from "../models/role.model.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";

// creating new role
export const createRole = asyncHandler(async (req, res) => {
  try {
    const { role } = req.body;
    const createdRole = await Role.create({ role });

    res.status(201).json(
      new ApiResponse(201, "Role is created", {
        role: createdRole,
      })
    );
  } catch (error) {
    throw error;
  }
});

// updating role
export const editRole = asyncHandler(async (req, res) => {
  try {
    const { roleId, role } = req.body;

    const updatedRole = await Role.updateOne({ role });
    res.status(200).json(
      new ApiResponse(200, "Role is updated", {
        role: updatedRole,
      })
    );
  } catch (error) {
    throw error;
  }
});

// deleting a role
export const deleteRole = asyncHandler(async (req, res) => {
  try {
    const { roleId } = req.body;
    const role = await Role.findById(roleId);
    if (!role) throw new ApiError(404, "Role not found");
    const roles = await Role.findByIdAndDelete(roleId);
    res.status(201).json(new ApiResponse(200, "Role is deleted"));
  } catch (error) {
    throw error;
  }
});

// getting all roles
export const getRoles = asyncHandler(async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(201).json(
      new ApiResponse(200, "Success", {
        roles,
      })
    );
  } catch (error) {
    throw error;
  }
});
