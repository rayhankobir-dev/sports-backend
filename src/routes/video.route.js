import { Router } from "express";
import auth from "../middleware/authentication.middleware.js";
import authorization from "../middleware/authorization.middleware.js";
import {
  uploadVideo,
  getVideos,
  getVideoBySlug,
  getVideosByGenre,
  editVideo,
  toggleVideo,
  deleteVideo,
  markedAsPracticed,
  rateVideo,
} from "../controllers/video.controller.js";
import { validation } from "../middleware/validator.middleware.js";
import videoSchema from "../validation/video.schema.js";
import { upload, validateFiles } from "../middleware/multer.middleware.js";
import { ValidationSource } from "../helpers/validator.js";
import { addWatchHistory } from "../controllers/user.controller.js";

const videoRoute = new Router();

// getting all videos
videoRoute.get("/", getVideos);

// upload new video
videoRoute.post(
  "/",
  upload({
    file: [".mp4", ".mpeg4"],
    thumbnail: [".jpg", ".jpeg", ".webp", ".png", ".gif"],
  }).fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validateFiles,
  validation(videoSchema.upload),
  auth,
  authorization(["player", "coach", "admin"]),
  uploadVideo
);
// update video information
videoRoute.put(
  "/",
  upload({
    thumbnail: [".jpg", ".png", ".jpeg", ".webp"],
    file: [".mp3", ".mpeg", ".wav"],
  }).fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validateFiles,
  auth,
  authorization(["coach", "admin"]),
  editVideo
);
// delete the video
videoRoute.delete(
  "/",
  validation(videoSchema.delete),
  auth,
  authorization(["coach", "admin"]),
  deleteVideo
);
// make video publish and hidden
videoRoute.put(
  "/toggle",
  validation(videoSchema.delete),
  auth,
  authorization(["coach", "admin"]),
  toggleVideo
);

// make video practiced
videoRoute.post(
  "/practiced",
  validation(videoSchema.delete),
  auth,
  authorization(["player"]),
  markedAsPracticed
);

videoRoute.post(
  "/rate",
  validation(videoSchema.rating),
  auth,
  authorization(["player"]),
  rateVideo
);

videoRoute.get(
  "/:slug",
  validation(videoSchema.slug, ValidationSource.PARAM),
  getVideoBySlug
);
videoRoute.get(
  "/genre/:slug",
  validation(videoSchema.slug, ValidationSource.PARAM),
  getVideosByGenre
);

videoRoute.put("/watch-history", auth, addWatchHistory);

export default videoRoute;
