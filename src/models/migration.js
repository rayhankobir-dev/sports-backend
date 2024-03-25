import { Role } from "./role.model.js";
import mongoose from "mongoose";
import { dbConfig } from "../config.js";

async function createRoles() {
  try {
    await mongoose.connect(dbConfig.url + dbConfig.name);
    // create predefined roles
    await Role.create([
      { role: "player" },
      { role: "coach" },
      { role: "admin" },
    ]);
    console.log("Roles created successfully!");
  } catch (error) {
    console.error("Error creating roles:", error);
  } finally {
    mongoose.disconnect();
  }
}

createRoles();
