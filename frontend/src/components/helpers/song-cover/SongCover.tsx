import { useState } from "react";
import { DEFAULT_SONG_COVER, getSongCoverArt } from "./songCover.utils";
import type { SongCoverProps } from "./types/SongCover.types";

const SongCover = ({ src, alt = "", onError, ...props }: SongCoverProps) => {
    const source = getSongCoverArt(src);
    const [failedSource, setFailedSource] = useState<string | null>(null);
    return <img {...props} src={failedSource === source ? DEFAULT_SONG_COVER : source} alt={alt} onError={event => {
        if (source !== DEFAULT_SONG_COVER) setFailedSource(source);
        onError?.(event);
    }} />;
};

export default SongCover;
