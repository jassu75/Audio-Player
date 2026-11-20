import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { setViewingSongList } from "../../../redux/slices/audioPlayerSlice";
import { postApi } from "../../../services/api";
import { indexSongs } from "../../../utils/songs";
const useFetchPlaylist = (playlistId: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        let active = true;
        const fetchPlaylist = async () => {
            try {
                setLoading(true);
                setError(false);
                dispatch(setViewingSongList(null));
                const response = await postApi("/api/fetchPlaylistSongs", {
                    playlist_id: playlistId,
                });
                const refinedResponse = indexSongs(response.data.playlists.map((playlist) => playlist.songs));
                if (active)
                    dispatch(setViewingSongList(refinedResponse));
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
    }, [dispatch, playlistId]);
    return { loading, error };
};
export default useFetchPlaylist;
