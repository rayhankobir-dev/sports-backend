import cors from "cors";
import express from "express";
import { corsConfig } from "./config.js";
import routes from "./routes/index.js";
import ApiError from "./helpers/ApiError.js";
import cookieParser from "cookie-parser";

// creating express app
const app = express();

// configuring middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// handle api routes
app.use("/api/v1", routes);

// not found route
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Not found!",
  });
});

// middleware error handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...err,
    });
  }
  console.log(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error!",
  });
});

// exporting express app
export default app;
