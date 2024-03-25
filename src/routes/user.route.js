import { Router } from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateProfile,
  userProfile,
  updateAvatar,
  changePassword,
  createUser,
  deleteUser,
  getAllAdmin,
  getAllCoach,
  getAllPlayers,
  getPracticeList,
  getRatedVideos,
  getPlaylists,
  addPlaylistItem,
  removePlaylistItem,
} from "../controllers/user.controller.js";
import userSchema from "../validation/user.schema.js";
import auth from "../middleware/authentication.middleware.js";
import { validation } from "../middleware/validator.middleware.js";
import authorization from "../middleware/authorization.middleware.js";
import { upload, validateFiles } from "../middleware/multer.middleware.js";

// creating & defining user routes
const userRoute = new Router();

userRoute.post("/signup", validation(userSchema.signup), signupUser);
userRoute.post("/login", validation(userSchema.login), loginUser);
userRoute.post("/logout", auth, logoutUser);
userRoute.get("/profile", auth, userProfile);
userRoute.post(
  "/refresh-token",
  validation(userSchema.refresh),
  refreshAccessToken
);
userRoute.delete("/", auth, authorization(["admin"]), deleteUser);
userRoute.put(
  "/update-profile",
  validation(userSchema.update),
  auth,
  updateProfile
);

userRoute.put(
  "/update-avatar",
  upload({
    avatar: [".jpg", ".jpeg", ".webp", ".png", ".gif"],
  }).fields([{ name: "avatar", maxCount: 1 }]),
  validateFiles,
  validation(userSchema.avatar),
  auth,
  updateAvatar
);
userRoute.put(
  "/change-password",
  validation(userSchema.password),
  auth,
  changePassword
);
userRoute.post(
  "/create",
  upload({
    avatar: [".jpg", ".jpeg", ".webp", ".png", ".gif"],
  }).fields([{ name: "avatar", maxCount: 1 }]),
  validateFiles,
  validation(userSchema.create),
  auth,
  authorization(["coach", "admin"]),
  createUser
);
userRoute.get(
  "/player",
  auth,
  authorization(["coach", "admin"]),
  getAllPlayers
);
userRoute.get("/admin", auth, authorization(["admin"]), getAllAdmin);
userRoute.get("/coach", auth, authorization(["admin"]), getAllCoach);
userRoute.get("/practicelist", auth, getPracticeList);
userRoute.get("/rated-videos", auth, getRatedVideos);
userRoute.get("/playlist", auth, authorization(["player"]), getPlaylists);
userRoute.put(
  "/playlist",
  validation(userSchema.playlist),
  auth,
  authorization(["player"]),
  addPlaylistItem
);
userRoute.delete(
  "/playlist",
  validation(userSchema.playlist),
  auth,
  authorization(["player"]),
  removePlaylistItem
);

export default userRoute;
