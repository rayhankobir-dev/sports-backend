import { Router } from "express";
import authSchema from "../validation/user.schema.js";
import { validation } from "../middleware/validator.middleware.js";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  signupUser,
} from "../controllers/user.controller.js";
import { auth } from "../middleware/authentication.middleware.js";
import authorization from "../middleware/authorization.middleware.js";

// creating & defining user routes
const userRoute = new Router();

userRoute.post("/signup", validation(authSchema.signup), signupUser);
userRoute.post("/login", validation(authSchema.login), loginUser);
userRoute.post("/logout", auth, authorization(["player"]), logoutUser);
userRoute.post("/refresh-token", refreshAccessToken);
// userRoute.get("/profile", userProfile);
// userRoute.post("/update-avatar", avatarController);
// userRoute.post("/update-profile", editProfileController);

export default userRoute;
