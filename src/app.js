import cors from "cors";
import express from "express";
import { corsConfig } from "./config.js";

// creating express app
const app = express();

// configuring middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  return res.send("Hellow");
});

app.use((req, res, error) => {
  console.log("Not found");
});

// exporting express app
export default app;
