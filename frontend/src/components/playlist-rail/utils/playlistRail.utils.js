import {
  DEFAULT_PLAYLIST_COVER,
  PLAYLIST_COVER_IMAGES,
} from "../../../assets/constants.js";

export const getUserPlaylistRailCover = (key) => {
  return PLAYLIST_COVER_IMAGES[key] ?? DEFAULT_PLAYLIST_COVER;
};
