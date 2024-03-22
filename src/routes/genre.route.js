import { Router } from "express";
import auth from "../middleware/authentication.middleware.js";
import authorization from "../middleware/authorization.middleware.js";
import {
  createGenre,
  editGenre,
  deleteGenre,
  getGenres,
  getGenreVideos,
} from "../controllers/genre.controller.js";
import { validation } from "../middleware/validator.middleware.js";
import genreSchema from "../validation/genre.schema.js";

const genreRoute = new Router();

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
genreRoute.get("/", getGenres);
genreRoute.get("/genre/videos", getGenreVideos);

export default genreRoute;
