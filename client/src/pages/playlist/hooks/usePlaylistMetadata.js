import { useMemo } from "react";
import { useSelector } from "react-redux";
import { playlistCollectionSelector } from "../../../redux/selectors/homepage.selector";

const usePlaylistMetadata = (playlistId) => {
  const playlistCollection = useSelector(playlistCollectionSelector);

  return useMemo(() => {
    const collection = playlistCollection.find((c) =>
      c.collection.some((p) => p.playlist_id === playlistId),
    );
    const playlist = collection?.collection.find(
      (p) => p.playlist_id === playlistId,
    );
    return {
      collectionId: collection?.id,
      type: collection?.type,
      playlistTitle: playlist?.playlist_title,
    };
  }, [playlistCollection, playlistId]);
};

export default usePlaylistMetadata;
