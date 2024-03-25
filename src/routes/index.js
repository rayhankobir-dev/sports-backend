import { Router } from "express";
import roleRoute from "./role.route.js";
import userRoute from "./user.route.js";
import genreRoute from "./genre.route.js";
import videoRoute from "./video.route.js";
import auth from "../middleware/authentication.middleware.js";
import {
  adminAnalytics,
  coachAnalytics,
} from "../controllers/user.controller.js";
import authorization from "../middleware/authorization.middleware.js";

// creating routes
const routes = new Router();

// use routes
routes.use("/role", roleRoute);
routes.use("/user", userRoute);
routes.use("/genre", genreRoute);
routes.use("/video", videoRoute);

// analytical routes
routes.get("/coach/analytics", auth, authorization(["coach"]), coachAnalytics);
routes.get("/admin/analytics", auth, authorization(["admin"]), adminAnalytics);

export default routes;
