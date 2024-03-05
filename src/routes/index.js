import { Router } from "express";
import userRoute from "./user.route.js";

const routes = new Router();
routes.use("/user", userRoute);
routes.get("/", (req, res) => {
  res.send("GET request to the homepage");
});
export default routes;
