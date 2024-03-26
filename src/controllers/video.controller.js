import { slugify } from "../utils/utils.js";
import ApiError from "../helpers/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Genre } from "../models/genre.model.js";
import { Rating } from "../models/rating.model.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// publish a video
export const uploadVideo = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const { title, description, file, genre, thumbnail } = req.body;
    const fileSize = file.size;

    const existGenre = await Genre.findById({ _id: genre });
    if (!existGenre) throw new ApiError(400, "Genre is not found!");

    const videFile = await uploadOnCloudinary(file.path);
    const { url } = await uploadOnCloudinary(thumbnail.path);

    const video = await Video.create({
      title,
      slug: slugify(title),
      description,
      file: videFile.url,
      genre: existGenre._id,
      owner: user._id,
      thumbnail: url,
      fileSize,
      format: videFile.format,
      duration: videFile.duration,
      playBackUrl: videFile.playback_url,
    });

    return res
      .status(201)
      .json(new ApiResponse(200, "Video successfully published", { video }));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error!");
  }
});

// update video info
export const editVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId, title, description, genre, thumbnail, file } = req.body;
    const existGenre = await Genre.findById(genre);
    if (!existGenre) throw new ApiError(400, "Genre not found");

    let video = await Video.findById(videoId);
    if (!video) throw new ApiError(400, "Video not found");

    video.title = title;
    video.slug = slugify(title);
    video.genre = genre;
    video.description = description;

    if (thumbnail?.path) {
      const { url } = await uploadOnCloudinary(thumbnail.path);
      video.thumbnail = url;
    }

    if (file?.path) {
      const videoFile = await uploadOnCloudinary(file.path);
      video.format = videoFile.format;
      video.duration = videoFile.duration;
      video.fileSize = file.size;
      video.file = videoFile.url;
      video.playBackUrl = videoFile.playback_url;
    }

    video.save();

    return res.status(200).json(new ApiResponse(200, "Video updated"));
  } catch (error) {
    throw error;
  }
});

// deleting video
export const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.body;
    const video = await Video.findById({ _id: videoId });
    if (!video) throw new ApiError(404, "Video not found");
    await Video.deleteOne({ _id: videoId });
    res.status(200).json(new ApiResponse(200, "Video is deleted"));
  } catch (error) {
    throw error;
  }
});

// get all videos
export const getVideos = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.aggregate([
      {
        $lookup: {
          from: "ratings",
          localField: "ratings",
          foreignField: "_id",
          as: "ratings",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $lookup: {
          from: "genres",
          localField: "genre",
          foreignField: "_id",
          as: "genre",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" },
          owner: { $arrayElemAt: ["$owner", 0] },
          genre: { $arrayElemAt: ["$genre", 0] },
        },
      },
      {
        $project: {
          title: 1,
          slug: 1,
          description: 1,
          playBackUrl: 1,
          format: 1,
          isPublished: 1,
          thumbnail: 1,
          file: 1,
          fileSize: 1,
          duration: 1,
          "owner._id": 1,
          "owner.fullName": 1,
          "owner.avatar": 1,
          "genre._id": 1,
          "genre.slug": 1,
          "genre.name": 1,
          averageRating: 1,
        },
      },
    ]);

    res.status(200).json(
      new ApiResponse(200, "Success", {
        videos,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error!");
  }
});

// make video hidden
export const toggleVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.body;
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    await Video.updateOne(
      { _id: videoId },
      { isPublished: !video.isPublished }
    );
    return res.status(200).json(new ApiResponse(200, "Video is updated"));
  } catch (error) {
    throw error;
  }
});

// marked as practice
export const markedAsPracticed = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    const user = await User.findById(req.user._id).populate("practiceList");
    const videoInPracticeList = user.practiceList.some((item) =>
      item.equals(videoId)
    );

    if (videoInPracticeList) throw new ApiError(409, "You already practiced");

    user.practiceList.push(videoId);
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Video marked as practiced"));
  } catch (error) {
    throw error;
  }
});

// rate the video
export const rateVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId, rating } = req.body;
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    const existingRating = await Rating.findOne({
      user: req.user._id,
      video: videoId,
    });

    if (existingRating)
      throw new ApiError(400, "You have already rated this video");

    const newRating = new Rating({
      user: req.user._id,
      video: video._id,
      rating,
    });

    const savedRating = await newRating.save();
    video.ratings.push(savedRating._id);
    await video.save();

    return res.status(201).json(
      new ApiResponse(201, "Rating added successfully", {
        video,
      })
    );
  } catch (error) {
    throw error;
  }
});

// get video by slug
export const getVideoBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const video = await Video.findOne({ slug }).populate("genre ratings owner");
    if (!video) throw new ApiError(404, "Video not found");

    const relatedVideos = await Video.find({
      genre: video.genre,
      _id: { $ne: video._id },
    }).limit(10);

    return res
      .status(200)
      .json(new ApiResponse(200, "Success", { video, relatedVideos }));
  } catch (error) {
    throw error;
  }
});

// get videos by genre
export const getVideosByGenre = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const genre = await Genre.findOne({ slug });
    if (!genre) throw new ApiError(400, "Genre not found");

    const videos = await Video.aggregate([
      {
        $match: {
          genre: genre._id,
          isPublished: true,
        },
      },
      {
        $lookup: {
          from: "ratings",
          localField: "ratings",
          foreignField: "_id",
          as: "ratings",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" },
        },
      },
      {
        $project: {
          title: 1,
          slug: 1,
          description: 1,
          playBackUrl: 1,
          format: 1,
          isPublished: 1,
          thumbnail: 1,
          file: 1,
          fileSize: 1,
          duration: 1,
          owner: 1,
          genre: 1,
          averageRating: 1,
        },
      },
    ]);

    return res.status(200).json(new ApiResponse(200, "Success", { videos }));
  } catch (error) {
    throw error;
  }
});

export const topWatchedVideos = async () => {
  const videos = await Video.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "watchHistory",
        as: "watchedUsers",
      },
    },
    {
      $lookup: {
        from: "genres",
        localField: "genre",
        foreignField: "_id",
        as: "genreDetails",
      },
    },
    {
      $addFields: {
        views: { $size: "$watchedUsers" },
      },
    },
    {
      $sort: { views: -1 },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        slug: 1,
        title: 1,
        thumbnail: 1,
        description: 1,
        views: 1,
        genreName: { $arrayElemAt: ["$genreDetails.name", 0] },
      },
    },
  ]);

  return videos;
};

export const coachPopularVideo = async (owner) => {
  const videos = await Video.aggregate([
    {
      $match: { owner },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "watchHistory",
        as: "watchedUsers",
      },
    },
    {
      $lookup: {
        from: "genres",
        localField: "genre",
        foreignField: "_id",
        as: "genreDetails",
      },
    },
    {
      $addFields: {
        views: { $size: "$watchedUsers" },
      },
    },
    {
      $sort: { views: -1 },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        slug: 1,
        title: 1,
        thumbnail: 1,
        description: 1,
        views: 1,
        genreName: { $arrayElemAt: ["$genreDetails.name", 0] },
      },
    },
  ]);

  return videos;
};

// getting videos by genre wise
export const getGenreVideoCount = async () => {
  const result = await Video.aggregate([
    {
      $group: {
        _id: "$genre",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "genres",
        localField: "_id",
        foreignField: "_id",
        as: "genre",
      },
    },
    {
      $unwind: {
        path: "$genre",
        preserveNullAndEmptyArrays: true, // Preserve unmatched genres
      },
    },
    {
      $project: {
        _id: 0,
        id: { $ifNull: ["$genre.slug", "Unknown"] },
        label: { $ifNull: ["$genre.name", "Unknown"] },
        value: { $ifNull: ["$count", 0] },
        color: { $literal: "hsl(139, 70%, 50%)" },
      },
    },
  ]);

  return result;
};

export const countWatchedUsers = async (owner) => {
  const result = await Video.aggregate([
    {
      $match: { owner },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "watchHistory",
        as: "watchedUsers",
      },
    },
    {
      $unwind: "$watchedUsers",
    },
    {
      $group: {
        _id: null,
        totalWatchedUsers: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalWatchedUsers : 0;
};

export const countPublishedCategoriesByOwner = async (owner) => {
  const result = await Video.aggregate([
    {
      $match: { owner },
    },
    {
      $group: {
        _id: "$genre",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalCategories: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalCategories : 0;
};

export const calculateTotalWatchTimeByOwner = async (owner) => {
  const result = await Video.aggregate([
    {
      $match: { owner },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "watchHistory",
        as: "watchedUsers",
      },
    },
    {
      $unwind: "$watchedUsers",
    },
    {
      $group: {
        _id: null,
        totalWatchTime: { $sum: { $toDouble: "$duration" } },
      },
    },
  ]);

  const totalWatchTimeInHours =
    result.length > 0 ? result[0].totalWatchTime / 3600 : 0;
  return totalWatchTimeInHours;
};

// getting video counts
export const getVideCount = async () => {
  try {
    const totalVideos = await Video.countDocuments();
    const publishedVideos = await Video.countDocuments({ isPublished: true });
    const unpublishedVideos = await Video.countDocuments({
      isPublished: false,
    });

    return { totalVideos, publishedVideos, unpublishedVideos };
  } catch (error) {
    throw error;
  }
};

export const getVideCountByOwner = async (owner) => {
  const totalVideos = await Video.countDocuments({
    owner,
  });
  const publishedVideos = await Video.countDocuments({
    owner,
    isPublished: true,
  });
  const unpublishedVideos = await Video.countDocuments({
    owner,
    isPublished: false,
  });

  return { totalVideos, publishedVideos, unpublishedVideos };
};
