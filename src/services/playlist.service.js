import { Playlist } from "../models/playlist.model.js";

// create new playlist
export const createPlaylist = async (playlistName, userId) => {
  const playlist = new Playlist({
    name: playlistName,
    user: userId,
  });
  const newPlaylist = await playlist.save();
  return newPlaylist;
};

// rename playlist
export const renamePlaylist = async (playlistId, playlistName) => {
  const playlist = await Playlist.findById(playlistId);
  playlist.name = playlistName;
  const updatedPlaylist = await playlist.save();
  return updatedPlaylist;
};

// delete playlist
export const deletePlaylist = async (playlistId) => {
  const playlist = await Playlist.findById(playlistId);
  await playlist.remove();
  return playlist;
};

// add new video into playlist
export const addVideoToPlaylist = async (playlistId, videoId) => {
  const playlist = await Playlist.findById(playlistId);
  playlist.videos.push(videoId);
  const updatedPlaylist = await playlist.save();
  return updatedPlaylist;
};

// remove video from playlist
export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  const playlist = await Playlist.findById(playlistId);
  const index = playlist.videos.indexOf(videoId);
  playlist.videos.splice(index, 1);
  const updatedPlaylist = await playlist.save();
  return updatedPlaylist;
};
