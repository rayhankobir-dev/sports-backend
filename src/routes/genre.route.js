import { Router } from "express";
import {
  createGenre,
  getGenres,
  editGenre,
  deleteGenre,
} from "../controllers/genre.controller.js";
import genreSchema from "../validation/genre.schema.js";
import auth from "../middleware/authentication.middleware.js";
import { validation } from "../middleware/validator.middleware.js";
import authorization from "../middleware/authorization.middleware.js";

// creating genre route
const genreRoute = new Router();

// defining genre routes
genreRoute.get("/", getGenres);
genreRoute.post(
  "/",
  validation(genreSchema.create),
  auth,
  authorization(["player", "admin"]),
  createGenre
);
genreRoute.put(
  "/",
  validation(genreSchema.edit),
  auth,
  authorization(["player", "admin"]),
  editGenre
);
genreRoute.delete(
  "/",
  validation(genreSchema.delete),
  auth,
  authorization(["player", "admin"]),
  deleteGenre
);

export default genreRoute;
