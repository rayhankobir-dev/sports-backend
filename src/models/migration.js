import { Role } from "./role.model.js";
import { User } from "./user.model.js";
import bcrypt from "bcrypt";

export async function seeding() {
  try {
    // seeding roles
    await createRoles();
    await createDefaultAdmin();
  } catch (error) {
    console.error("Seeding error:", error);
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

async function createDefaultAdmin() {
  try {
    const adminRole = await Role.findOne({ role: "admin" }).lean();
    const existingAdmin = await User.findOne({ role: adminRole._id }).lean();

    if (!existingAdmin) {
      const defaultAdminData = {
        fullName: "Admin",
        email: "admin@gmail.com",
        password: "Admin@1234",
        role: adminRole._id,
      };

      await User.create(defaultAdminData);
      console.log("Sedding: default admin created");
      console.log("Created admin info: (admin@gmail.com, Admin@1234)");
      console.log("Please don't forget to delete this user");
      console.log("--------->");
    }
  } catch (error) {
    console.error("Seeding error:", error);
  }
}
