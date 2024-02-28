import mongoose from "mongoose";

// creating role schema
const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      uniquie: true,
      lovercase: true,
    },
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);
