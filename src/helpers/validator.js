import Joi from "joi";

export const Header = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

export const ValidationSource = {
  BODY: "body",
  HEADER: "headers",
  QUERY: "query",
  PARAM: "params",
  FILE: "files",
};

// url endpoint validation
export const JoiUrlEndpoint = () =>
  Joi.string().custom((value, helpers) => {
    if (value.includes("://")) return helpers.error("any.invalid");
    return value;
  }, "Invalid URL form!");

// bearer token validation
export const JoiAuthBearer = () =>
  Joi.string().custom((value, helpers) => {
    const token = value.split(" ")[1];
    if (!value.startsWith("Bearer ") || !token) {
      return helpers.error("string.invalidBearerToken");
    }
    return value;
  }, "Authorization Header Validation");

// auth validation
export const schema = {
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
};
