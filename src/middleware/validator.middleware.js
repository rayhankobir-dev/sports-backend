import { ValidationSource } from "../helpers/validator.js";
import { capitalizeString } from "../utils/utils.js";

// request validation
export const validation =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      const { error } = schema.validate(req[source], { abortEarly: true });
      if (!error) return next();

      if (source === ValidationSource.HEADER) {
        return res.status(505).json({
          success: false,
          message: "Permission denied",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Bad request",
        error: capitalizeString(error.details[0].message.replace(/['"]+/g, "")),
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Bad request",
        error,
      });
    }
  };
