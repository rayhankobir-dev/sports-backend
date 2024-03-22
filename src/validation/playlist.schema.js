import Joi from "joi";

const playlistSchema = {
  create: Joi.object().keys({
    name: Joi.string().required(),
  }),
  edit: Joi.object().keys({
    playlistId: Joi.string().required(),
    name: Joi.string().required(),
  }),
  add: Joi.object().keys({
    playlistId: Joi.string().required(),
    videoId: Joi.string().required(),
  }),
  delete: Joi.object().keys({
    playlistId: Joi.string().required(),
  }),
};

export default playlistSchema;
