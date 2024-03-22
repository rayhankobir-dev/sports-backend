import { Router } from "express";
import auth from "../middleware/authentication.middleware.js";
import authorization from "../middleware/authorization.middleware.js";
import {
  createRole,
  editRole,
  deleteRole,
  getRoles,
  getRoleUsers,
} from "../controllers/role.controller.js";

const roleRoute = new Router();

roleRoute.post("/", auth, authorization(["admin"]), createRole);
roleRoute.put("/", auth, authorization(["admin"]), editRole);
roleRoute.delete("/", auth, authorization(["admin"]), deleteRole);
roleRoute.get("/", getRoles);
roleRoute.get("/user", getRoleUsers);

export default roleRoute;
