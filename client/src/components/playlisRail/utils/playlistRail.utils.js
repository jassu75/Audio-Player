import {
  DEFAULT_PLAYLIST_COVER,
  PLAYLIST_COVER_IMAGES,
} from "../../../assets/assets.consts";

export const getUserPlaylistRailCover = (key) => {
  return PLAYLIST_COVER_IMAGES[key] ?? DEFAULT_PLAYLIST_COVER;
};
