import { Genre } from "../models/genre.model.js";

// getting all genres
export const getAllGenres = async () => {
  const genres = await Genre.find();
  return genres;
};

// getting genre by genre name
export const getGenreById = async (genreName) => {
  const genre = await Genre.findOne({ name: genreName });
  return genre;
};

// getting genre by genre id
export const getGenreById = async (genreId) => {
  const genre = await Genre.findById(genreId);
  return genre;
};

// creating new genre
export const createGenre = async (genreName) => {
  const genre = new Genre({ name: genreName });
  const newGenre = await genre.save();
  return newGenre;
};

// updating genre by genre id
export const updateGenre = async (genreId, genreName) => {
  const genre = await Genre.findById(genreId);
  genre.name = genreName;
  const updatedGenre = await genre.save();
  return updatedGenre;
};

// deleting genre by genre id
export const deleteGenre = async (genreId) => {
  const genre = await Genre.findById(genreId);
  await genre.remove();
  return genre;
};

// getting all users who own the genre
export const getUsersByGenre = async (genreId) => {
  const users = await User.find({ genres: genreId });
  return users;
};
