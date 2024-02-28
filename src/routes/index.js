import { Route } from "express";

const route = new Route();
route.get("/", (req, res) => {
  return res.send("Hello world");
});

export default route;
