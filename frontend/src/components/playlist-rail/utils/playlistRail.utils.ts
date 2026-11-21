import { DEFAULT_PLAYLIST_COVER, PLAYLIST_COVER_IMAGES, } from "../../../assets/constants";
export const getUserPlaylistRailCover = (key: string | undefined) => {
    if (key && (key.startsWith("/") || /^https?:\/\//i.test(key))) return key;
    return PLAYLIST_COVER_IMAGES[key ?? ""] ?? DEFAULT_PLAYLIST_COVER;
};
