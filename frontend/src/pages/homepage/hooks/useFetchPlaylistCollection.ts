import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useAppStore,
} from "../../../redux/hooks";
import { userSelector } from "../../../redux/selectors/homepageSelectors";
import { setPlaylistCollection } from "../../../redux/slices/homepageSlice";
import { PLAYLIST_COLLECTIONS } from "../constants/playlistCollections";

const useFetchPlaylistCollection = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const userId = useAppSelector(userSelector)?.user_id;
  const [status, setStatus] = useState({ loading: true, error: false });
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    const cachedCollections = store.getState().homepage.playlistCollection;
    setStatus({ loading: true, error: false });
    Promise.all(
      PLAYLIST_COLLECTIONS.map(async (config) => {
        const cached = config.cache
          ? cachedCollections?.find((collection) => collection.id === config.id)
              ?.collection
          : undefined;
        return {
          id: config.id,
          title: config.title,
          type: config.type,
          collection:
            cached ?? (await config.loadPlaylists(userId, controller.signal)),
        };
      }),
    )
      .then((collections) => {
        if (controller.signal.aborted) return;
        if (
          JSON.stringify(store.getState().homepage.playlistCollection) !==
          JSON.stringify(collections)
        ) {
          dispatch(setPlaylistCollection(collections));
        }
        setStatus({ loading: false, error: false });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setStatus({ loading: false, error: true });
      });
    return () => controller.abort();
  }, [dispatch, store, userId]);
  return { loading: status.loading || !userId, error: status.error };
};

export default useFetchPlaylistCollection;
