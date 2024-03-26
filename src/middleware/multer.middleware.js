import path from "path";
import multer from "multer";
import ApiError from "../helpers/ApiError.js";
import { environment } from "../config.js";

// multer middleware configuration
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let tempraryImageDirectory = null;
    if (environment === "dev") {
      tempraryImageDirectory = process.cwd() + `/public/temp/`;
    } else {
      tempraryImageDirectory = "/tmp/";
    }
    callback(null, tempraryImageDirectory);
  },
  filename: function (req, file, callback) {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const prefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + prefix + fileExt);
  },
});

// multer file filter function
const fileFilter = function (allowedExtensions) {
  return function (req, file, callback) {
    const fieldname = file.fieldname;
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions[fieldname].includes(fileExt)) {
      callback(null, true);
    } else {
      callback(new ApiError("Invalid file type of the " + fieldname));
    }
  };
};

// upload the image into local storgae
export const upload = (allowedExtensions) =>
  multer({
    storage: storage,
    fileFilter: fileFilter(allowedExtensions),
  });

// validate the file which gonna upload
export function validateFiles(req, res, next) {
  Object.keys(req.files).forEach((fieldName) => {
    req.body[fieldName] = req.files[fieldName][0];
  });
  next();
}
