import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { userSelector } from "../../../redux/selectors/homepageSelectors";
import { setRecentlyPlayed } from "../../../redux/slices/userPreferencesSlice";
import { setViewingSongList } from "../../../redux/slices/audioPlayerSlice";
import { postApi } from "../../../services/api";
import { indexSongs } from "../../../utils/songs";
const useFetchPlaylist = (playlistId: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const dispatch = useAppDispatch();
    const userId = useAppSelector(userSelector)?.user_id;
    useEffect(() => {
        if ((playlistId === "recently-played" || playlistId === "most-played") && !userId) return;
        let active = true;
        const fetchPlaylist = async () => {
            try {
                setLoading(true);
                setError(false);
                dispatch(setViewingSongList(null));
                const songs = playlistId === "recently-played"
                    ? (await postApi("/api/fetchrecentlyplayed", { user_id: userId! })).data.recently_played
                    : playlistId === "most-played"
                        ? (await postApi("/api/fetchMostListened", { user_id: userId! })).data.most_listened
                        : (await postApi("/api/fetchPlaylistSongs", { playlist_id: playlistId })).data.playlists.map(playlist => playlist.songs);
                if (active) {
                    dispatch(setViewingSongList(indexSongs(songs)));
                    if (playlistId === "recently-played") dispatch(setRecentlyPlayed(indexSongs(songs)));
                }
            }
            catch (error) {
                if (active)
                    setError(true);
                console.error("Error fetching songs", error);
            }
            finally {
                if (active)
                    setLoading(false);
            }
        };
        fetchPlaylist();
        return () => {
            active = false;
        };
    }, [dispatch, playlistId, userId]);
    return { loading, error };
};
export default useFetchPlaylist;
