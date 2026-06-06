import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PLAYLIST_COLLECTION_CONFIG } from "../consts/homepage.consts";
import { setPlaylistCollection } from "../../../redux/slices/homepage.slice";
import { playlistCollectionSelector } from "../../../redux/selectors/homepage.selector";

const useFetchPlaylistCollection = () => {
  const dispatch = useDispatch();
  const playlistCollection = useSelector(playlistCollectionSelector);
  const shouldFetch = !playlistCollection?.length;

  const results = PLAYLIST_COLLECTION_CONFIG.map((config) =>
    config.hook(shouldFetch),
  );
  const loading = results.some((r) => r.loading);
  const error = results.some((r) => r.error);
  const hasData = results.every((r) => r.collection !== null);
  const loadingKey = results.map((r) => r.loading).join();
  const dataKey = results.map((r) => JSON.stringify(r.collection)).join();

  const newPlaylistCollection = useMemo(
    () =>
      PLAYLIST_COLLECTION_CONFIG.map((config, i) => ({
        id: config.id,
        title: config.title,
        type: config.type,
        collection: results[i].collection,
      })),
    [loadingKey, dataKey, hasData], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (!shouldFetch || loading || error || !hasData) return;
    dispatch(setPlaylistCollection(newPlaylistCollection));
  }, [dispatch, error, hasData, loading, newPlaylistCollection, shouldFetch]);

  if (!shouldFetch) return { loading: false, error: false };
  return { loading, error };
};

export default useFetchPlaylistCollection;
