import { Router } from "express";
import { validation } from "../middleware/validator.middleware.js";
import auth from "../middleware/authentication.middleware.js";
import authorization from "../middleware/authorization.middleware.js";
import {
  addPlaylistItem,
  createPlaylist,
  editPlaylist,
  getPlaylists,
  removePlaylistItem,
} from "../controllers/playlist.controller.js";
import playlistSchema from "../validation/playlist.schema.js";

const playlistRoute = new Router();

playlistRoute.get("/", auth, authorization(["player"]), getPlaylists);

// create new playlist
playlistRoute.post(
  "/",
  validation(playlistSchema.create),
  auth,
  authorization(["player"]),
  createPlaylist
);

// rename playlist name
playlistRoute.put("/", validation(playlistSchema.edit), auth, editPlaylist);

// adding video into a playlist
playlistRoute.post(
  "/add",
  validation(playlistSchema.add),
  auth,
  authorization(["player"]),
  addPlaylistItem
);

// remove video from playlist
playlistRoute.delete(
  "/remove",
  validation(playlistSchema.add),
  auth,
  authorization(["player"]),
  removePlaylistItem
);

export default playlistRoute;
