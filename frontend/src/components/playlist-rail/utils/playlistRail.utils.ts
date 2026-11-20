import { DEFAULT_PLAYLIST_COVER, PLAYLIST_COVER_IMAGES, } from "../../../assets/constants";
export const getUserPlaylistRailCover = (key: string | undefined) => {
    return PLAYLIST_COVER_IMAGES[key ?? ""] ?? DEFAULT_PLAYLIST_COVER;
};
