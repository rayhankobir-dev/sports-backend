import mongoose from "mongoose";
import { dbConfig } from "../config.js";

// connecting to the database
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      dbConfig.url + dbConfig.name
    );
    console.log("Database connected!");
  } catch (error) {
    console.log("FAILED: Database connection failed ", error);
    process.exit(1);
  }
};

export default connectDB;
