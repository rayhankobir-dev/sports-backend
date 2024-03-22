import mongoose, { Schema } from "mongoose";

// creating rating schema
const ratingSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      max: 5,
      min: 1,
      defualt: 1,
    },
  },
  { timestamps: true }
);

ratingSchema.index({ user: 1, video: 1 }, { unique: true });

export const Rating = mongoose.model("Rating", ratingSchema);
