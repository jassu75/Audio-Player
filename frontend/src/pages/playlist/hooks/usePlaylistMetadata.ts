import { useMemo } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { playlistCollectionSelector } from "../../../redux/selectors/homepageSelectors";
import forYou from "../../../assets/json/forYou.json";
const usePlaylistMetadata = (playlistId: string) => {
    const playlistCollection = useAppSelector(playlistCollectionSelector);
    return useMemo(() => {
        const personalPlaylist = forYou.data.find(playlist => playlist.id === playlistId && playlist.id !== "favorites");
        if (personalPlaylist) return { collectionId: "for-you", type: "system" as const, playlistTitle: personalPlaylist.title };
        const collection = playlistCollection?.find((c) => c.collection.some((p) => p.playlist_id === playlistId));
        const playlist = collection?.collection.find((p) => p.playlist_id === playlistId);
        return {
            collectionId: collection?.id,
            type: collection?.type,
            playlistTitle: playlist?.playlist_title,
        };
    }, [playlistCollection, playlistId]);
};
export default usePlaylistMetadata;
