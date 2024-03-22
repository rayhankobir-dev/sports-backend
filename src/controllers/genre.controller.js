import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Genre } from "../models/genre.model.js";
import { Role } from "../models/role.model.js";
import { slugify } from "../utils/utils.js";

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

export const editGenre = asyncHandler(async (req, res) => {
  try {
    const { genreId, name } = req.body;

    await Genre.updateOne({ _id: genreId }, { $set: { name: name } });
    res.status(200).json(new ApiResponse(200, "Genre is updated"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error!");
  }
});

export const deleteGenre = asyncHandler(async (req, res) => {
  try {
    const { genreId } = req.body;
    const genre = await Genre.findById({ _id: genreId });
    if (!genre) throw new ApiError(404, "Genre not found");

    await Genre.deleteOne({ _id: genreId });
    res.status(201).json(new ApiResponse(200, "Genre is deleted"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error!");
  }
});

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

export const getGenreVideos = asyncHandler(async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(201).json(
      new ApiResponse(200, "Success", {
        roles,
      })
    );
  } catch (error) {
    console.log(error);
  }
});
