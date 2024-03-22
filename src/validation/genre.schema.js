import Joi from "joi";

const genreSchema = {
  create: Joi.object().keys({
    name: Joi.string().required(),
  }),
  edit: Joi.object().keys({
    genreId: Joi.string().required(),
    name: Joi.string().required(),
  }),
  delete: Joi.object().keys({
    genreId: Joi.string().required(),
  }),
};

export default genreSchema;
