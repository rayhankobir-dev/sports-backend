import mongoose, { Schema } from "mongoose";

const genreSchema = new Schema(
  {
    name: {
      type: String,
      requried: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    slug: {
      type: String,
      requried: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Genre = mongoose.model("Genre", genreSchema);
