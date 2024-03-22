import Joi from "joi";
import { imageSchema } from "./video.schema.js";

const userSchema = {
  login: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),

  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  signup: Joi.object().keys({
    fullName: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),

  otp: Joi.object().keys({
    otp: Joi.string()
      .length(4)
      .pattern(/^\d+$/)
      .message("OTP must be a 4-digit number"),
  }),
  create: Joi.object().keys({
    fullName: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
    avatar: imageSchema.required(),
    genre: Joi.string().optional(),
    role: Joi.string().valid("player", "coach", "admin").required(),
  }),
  delete: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  avatar: Joi.object().keys({
    avatar: imageSchema.required(),
  }),
  updateProfile: Joi.object().keys({
    fullName: Joi.string().min(4).required(),
    weight: Joi.number().required(),
    height: Joi.number().required(),
    country: Joi.string().required(),
    genre: Joi.string().optional(),
    email: Joi.string().optional(),
  }),
  password: Joi.object().keys({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),
};

export default userSchema;
