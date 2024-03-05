import Joi from "joi";

const authSchema = {
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
};

export default authSchema;
