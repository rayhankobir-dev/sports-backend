import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";

// getting all playlists
export const getPlaylists = asyncHandler(async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).populate(
      "videos"
    );

    res.status(200).json(
      new ApiResponse(200, "Success", {
        playlists,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

// getting playlist by id
export const getPlaylistById = asyncHandler(async (req, res) => {
  try {
    const playlist = await Playlist.find();
    res.status(200).json(
      new ApiResponse(200, "Success", {
        playlist,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

// create a new playlist
export const createPlaylist = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const user = req.user;

    const createdPlaylist = await Playlist.create({ name, owner: user._id });
    res.status(201).json(
      new ApiResponse(201, "Playlist is created", {
        playlist: createdPlaylist,
      })
    );
  } catch (error) {
    console.log(error);
  }
});

// rename playlist
export const editPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, name } = req.body;
    const updatedPlaylist = await Playlist.updateOne(
      { _id: playlistId },
      {
        name,
      }
    );
    res.status(200).json(
      new ApiResponse(200, "Playlist name is updated", {
        playlist: updatedPlaylist,
      })
    );
  } catch (error) {
    throw new ApiError(404, "Playlist not found");
  }
});

// delete playlist
export const deletePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.body;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");
    if (playlist.owner._id.toString() !== req.user._id.toString())
      throw new ApiError(403, "Permision denied");
    res.status(200).json(new ApiResponse(200, "Playlist is deleted"));
  } catch (error) {
    throw error;
  }
});

// add video into a playlist
export const addPlaylistItem = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  try {
    console.log(req.user);
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    if (playlist.owner._id.toString() !== req.user._id.toString())
      throw new ApiError(403, "Permision denied");

    if (playlist.videos.includes(videoId))
      throw new ApiError(400, "Video already exists in the playlist");

    playlist.videos.push(videoId);
    await playlist.save();

    return res.status(200).json(
      new ApiResponse(200, "Video added to playlist", {
        playlist,
      })
    );
  } catch (error) {
    throw error;
  }
});

// remove video from a playlist
export const removePlaylistItem = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");
    if (playlist.owner._id.toString() !== req.user._id.toString())
      throw new ApiError(403, "Permision denied");
    if (!playlist.videos.includes(videoId))
      throw new ApiError(404, "Video does not esist in playlist");
    playlist.videos = playlist.videos.filter((v) => v.toString() !== videoId);
    await playlist.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Removed from playlist", { playlist }));
  } catch (error) {
    throw error;
  }
});
