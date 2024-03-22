import { Router } from "express";
import userRoute from "./user.route.js";
import genreRoute from "./genre.route.js";
import videoRoute from "./video.route.js";
import playlistRoute from "./playlist.route.js";
import roleRoute from "./role.route.js";
import auth from "../middleware/authentication.middleware.js";
import authorization from "../middleware/authorization.middleware.js";
import { adminAnalytics } from "../controllers/user.controller.js";

const routes = new Router();
routes.use("/role", roleRoute);
routes.use("/user", userRoute);
routes.use("/genre", genreRoute);
routes.use("/video", videoRoute);
routes.use("/playlist", playlistRoute);
routes.get("/coach/analytics", auth, authorization(["coach"]), adminAnalytics);
routes.get("/admin/analytics", auth, authorization(["admin"]), adminAnalytics);
export default routes;
