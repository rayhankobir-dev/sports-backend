import dotenv from "dotenv";
// configuring dotenv
dotenv.config();

// server configuration
export const port = process.env.PORT || 3000;
export const host = process.env.HOST || "localhost";
export const environment = process.env.ENVIRONMENT || "production";

// cors policy confiuration
export const corsConfig = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// db configuration
export const dbConfig = {
  url: process.env.DATABASE_URL || "mongodb://localhost/nodejs",
  host: process.env.DATABASE_HOST || "localhost",
  name: process.env.DATABASE_NAME || "nodejs",
  user: process.env.DATABASE_USER || "nodejs",
  password: process.env.DATABASE_PASSWORD || "nodejs",
};

// mail configuration
export const mailConfig = {
  sender: process.env.SENDER_EMAIL || "",
  password: process.env.MAIL_PASSWORD || "",
  host: process.env.MAIL_HOST || "",
  port: process.env.MAIL_PORT || 465,
  secure: process.env.MAIL_SECURE || true,
  user: process.env.MAIL_USER || "",
};

// token configuration
export const tokenConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "nodejs",
  accessTokenExpireIn: process.env.ACCESS_TOKEN_EXPIRY || "7d",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "nodejs",
  refreshTokenExpireIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
};

// cloudinary configuration
export const cloudinaryConfig = {
  url: process.env.CLOUDINARY_URL,
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};
