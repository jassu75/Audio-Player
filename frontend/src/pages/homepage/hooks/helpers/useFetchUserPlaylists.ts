import { useEffect, useState } from "react";
import axiosAuth from "../../../../config/axiosAuth";
import { useAppSelector } from "../../../../redux/hooks";
import { userSelector } from "../../../../redux/selectors/homepageSelectors";
import type { Playlist } from "../../../../components/playlist-rail/types/playlist.types";
const useFetchUserPlaylists = (enabled = true) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [collection, setCollection] = useState<Playlist[] | null>(null);
    const user = useAppSelector(userSelector);
    useEffect(() => {
        const fetchUserPlaylists = async () => {
            if (!user)
                return;
            try {
                setLoading(true);
                setError(false);
                const response = await axiosAuth.post<{
                    playlist_details: Playlist[];
                }>("/api/getPlaylists", {
                    user_id: user.user_id,
                });
                const refinedResponse = response.data.playlist_details;
                setCollection(refinedResponse);
            }
            catch (error) {
                setError(true);
                console.error("Error fetching User Playlists", error);
            }
            finally {
                setLoading(false);
            }
        };
        if (!enabled)
            return;
        if (user)
            fetchUserPlaylists();
    }, [enabled, user]);
    return { loading, error, collection };
};
export default useFetchUserPlaylists;
