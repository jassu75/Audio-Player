import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PLAYLIST_COLLECTIONS } from "../constants/playlistCollections";
import { setPlaylistCollection } from "../../../redux/slices/homepageSlice";
import { playlistCollectionSelector } from "../../../redux/selectors/homepageSelectors";
import useFetchUserPlaylists from "./helpers/useFetchUserPlaylists";
import useFetchSystemPlaylists from "./helpers/useFetchSystemPlaylists";

const useFetchPlaylistCollection = () => {
  const dispatch = useDispatch();
  const playlistCollection = useSelector(playlistCollectionSelector);
  const shouldFetch = !playlistCollection?.length;
  const user = useFetchUserPlaylists(shouldFetch);
  const system = useFetchSystemPlaylists(shouldFetch);
  const userCollection = user.collection;
  const systemCollection = system.collection;
  const error = user.error || system.error;
  const hasData = userCollection !== null && systemCollection !== null;
  const loading = user.loading || system.loading || (!hasData && !error);
  const collections = useMemo(() => PLAYLIST_COLLECTIONS.map((config) => ({
    ...config,
    collection: config.type === "user" ? userCollection : systemCollection,
  })), [userCollection, systemCollection]);

  useEffect(() => {
    if (shouldFetch && !loading && !error && hasData) {
      dispatch(setPlaylistCollection(collections));
    }
  }, [dispatch, shouldFetch, loading, error, hasData, collections]);

  return shouldFetch ? { loading, error } : { loading: false, error: false };
};

export default useFetchPlaylistCollection;
