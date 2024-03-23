import Joi from "joi";

// genre validation schema
const genreSchema = {
  create: Joi.object().keys({
    name: Joi.string().min(4).required(),
  }),
  edit: Joi.object().keys({
    genreId: Joi.string().required(),
    name: Joi.string().min(4).required(),
  }),
  delete: Joi.object().keys({
    genreId: Joi.string().required(),
  }),
};

export default genreSchema;
