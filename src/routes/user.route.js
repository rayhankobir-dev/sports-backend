import { Router } from "express";
import userSchema from "../validation/user.schema.js";
import { validation } from "../middleware/validator.middleware.js";
import {
  changePassword,
  createUser,
  deleteUser,
  getAllAdmin,
  getAllCoach,
  getAllPlayers,
  getPracticeList,
  getRatedVideos,
  loginUser,
  logoutUser,
  refreshAccessToken,
  signupUser,
  updateAvatar,
  updateProfile,
  userProfile,
} from "../controllers/user.controller.js";
import auth from "../middleware/authentication.middleware.js";
import authorization from "../middleware/authorization.middleware.js";
import { upload, validateFiles } from "../middleware/multer.middleware.js";

// creating & defining user routes
const userRoute = new Router();

userRoute.post("/signup", validation(userSchema.signup), signupUser);
userRoute.post("/login", validation(userSchema.login), loginUser);
userRoute.post("/logout", auth, logoutUser);
userRoute.post("/refresh-token", refreshAccessToken);
userRoute.get("/profile", auth, userProfile);
userRoute.delete("/", auth, authorization(["admin"]), deleteUser);
userRoute.put(
  "/update-profile",
  validation(userSchema.updateProfile),
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
userRoute.post(
  "/create",
  upload({
    avatar: [".jpg", ".jpeg", ".webp", ".png", ".gif"],
  }).fields([{ name: "avatar", maxCount: 1 }]),
  validateFiles,
  validation(userSchema.create),
  auth,
  authorization(["admin"]),
  createUser
);
userRoute.get("/admin", auth, authorization(["admin"]), getAllAdmin);
userRoute.get("/coach", auth, authorization(["admin"]), getAllCoach);
userRoute.get("/practicelist", auth, getPracticeList);
userRoute.get("/rated-videos", auth, getRatedVideos);

userRoute.get(
  "/player",
  auth,
  authorization(["coach", "admin"]),
  getAllPlayers
);

userRoute.put(
  "/change-password",
  validation(userSchema.password),
  auth,
  changePassword
);

export default userRoute;
