import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { playlistCollectionSelector } from "../../../redux/selectors/homepageSelectors";
import { setPlaylistCollection } from "../../../redux/slices/homepageSlice";
import { PLAYLIST_COLLECTIONS } from "../constants/playlistCollections";
import useFetchSystemPlaylists from "./helpers/useFetchSystemPlaylists";
import useFetchUserPlaylists from "./helpers/useFetchUserPlaylists";
const useFetchPlaylistCollection = () => {
    const dispatch = useAppDispatch();
    const playlistCollection = useAppSelector(playlistCollectionSelector);
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
        collection: (config.type === "user" ? userCollection : systemCollection) ?? [],
    })), [userCollection, systemCollection]);
    useEffect(() => {
        if (shouldFetch && !loading && !error && hasData) {
            dispatch(setPlaylistCollection(collections));
        }
    }, [dispatch, shouldFetch, loading, error, hasData, collections]);
    return shouldFetch ? { loading, error } : { loading: false, error: false };
};
export default useFetchPlaylistCollection;
