import { Role } from "./role.model.js";
import mongoose from "mongoose";
import { dbConfig } from "../config.js";

async function seeding() {
  try {
    await mongoose.connect(dbConfig.url + dbConfig.name);

    // seeding roles
    createRoles();
  } catch (error) {
    console.error("Error creating roles:", error);
  } finally {
    mongoose.disconnect();
  }
}

async function createRoles() {
  const existingRoles = await Role.find().lean();

  const rolesToCreate = [
    { role: "player" },
    { role: "coach" },
    { role: "admin" },
  ].filter(
    (newRole) => !existingRoles.some((role) => role.role === newRole.role)
  );

  if (rolesToCreate.length > 0) {
    await Role.create(rolesToCreate);
    console.log("Seeding: ---> roles created successfully");
  } else {
    console.log("Seeding: ---> roles already exist");
  }
}

seeding();
