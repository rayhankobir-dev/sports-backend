import Joi from "joi";

// video file schema for validation
export const videFileSchema = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string(),
  mimetype: Joi.string().valid("video/mpeg4", "video/mp4").required(),
  destination: Joi.string().required(),
  filename: Joi.string().required(),
  path: Joi.string().required(),
  size: Joi.number()
    .max(60000000)
    .message("The size must be less than or equal to 50MB")
    .required(),
});

export const imageSchema = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string(),
  mimetype: Joi.string()
    .valid("image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg")
    .required(),
  destination: Joi.string().required(),
  filename: Joi.string().required(),
  path: Joi.string().required(),
  size: Joi.number().required(),
});

// video schema
const videoSchema = {
  upload: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    file: videFileSchema.required(),
    thumbnail: imageSchema.required(),
    genre: Joi.string().required(),
  }),
  edit: Joi.object().keys({
    videoId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    file: videFileSchema.required(),
  }),
  delete: Joi.object().keys({
    videoId: Joi.string().required(),
  }),
  rating: Joi.object().keys({
    videoId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  }),
  slug: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

export default videoSchema;
