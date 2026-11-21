export const DEFAULT_SONG_COVER = "/images/defaultMusicImage.webp";

export const getSongCoverArt = (source?: string | null) => {
    const cover = source?.trim();
    return !cover || /(?:^|\/)defaultMusicImage(?:[.-][^/?#]*)?(?:[?#].*)?$/i.test(cover)
        ? DEFAULT_SONG_COVER
        : cover;
};
