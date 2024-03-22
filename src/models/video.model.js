import mongoose from "mongoose";

// creating video schema
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    },
    playBackUrl: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchema);
