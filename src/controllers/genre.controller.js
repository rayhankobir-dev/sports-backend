import asyncHandler from "../helpers/asyncHandler.js";
import ApiResponse from "../helpers/ApiResponse.js";
import { Genre } from "../models/genre.model.js";
import ApiError from "../helpers/ApiError.js";
import { slugify } from "../utils/utils.js";
import { Video } from "../models/video.model.js";

// creating a new genre
export const createGenre = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const createdGenre = await Genre.create({
      name: name,
      slug: slugify(name),
    });

    res.status(201).json(
      new ApiResponse(201, "Genre is created", {
        genre: createdGenre,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error!");
  }
});

// updating a genre
export const editGenre = asyncHandler(async (req, res) => {
  try {
    const { genreId, name } = req.body;

    await Genre.updateOne({ _id: genreId }, { $set: { name: name } });
    res.status(200).json(new ApiResponse(200, "Genre is updated"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error!");
  }
});

// delete a genre
export const deleteGenre = asyncHandler(async (req, res) => {
  try {
    const { genreId } = req.body;
    const genre = await Genre.findById(genreId);
    if (!genre) throw new ApiError(404, "Genre not found");

    await Genre.deleteOne({ _id: genreId });
    await Video.deleteMany({ genre: genreId });

    res.status(200).json(new ApiResponse(200, "Genre is deleted"));
  } catch (error) {
    console.log(error);
    throw error;
  }
});

// getting all genres
export const getGenres = asyncHandler(async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(201).json(
      new ApiResponse(200, "Success", {
        genres,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error!");
  }
});
