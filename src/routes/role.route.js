import { Router } from "express";
import auth from "../middleware/authentication.middleware.js";
import authorization from "../middleware/authorization.middleware.js";
import {
  createRole,
  getRoles,
  editRole,
  deleteRole,
} from "../controllers/role.controller.js";

// creating role route
const roleRoute = new Router();

// defining role routes
roleRoute.post("/", auth, authorization(["admin"]), createRole);
roleRoute.get("/", auth, authorization(["admin"]), getRoles);
roleRoute.put("/", auth, authorization(["admin"]), editRole);
roleRoute.delete("/", auth, authorization(["admin"]), deleteRole);

export default roleRoute;
