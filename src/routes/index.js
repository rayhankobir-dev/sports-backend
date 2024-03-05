import { Router } from "express";
import userRoute from "./user.route.js";

const routes = new Router();
routes.get("/", (req, res) => {
  res.send("Ok");
});
routes.use("/user", userRoute);

export default routes;
