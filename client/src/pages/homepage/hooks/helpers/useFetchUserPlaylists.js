import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosAuth from "../../../../config/axiosAuth";
import { userSelector } from "../../../../redux/selectors/homepage.selector";

const useFetchUserPlaylists = (enabled = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [collection, setCollection] = useState(null);
  const user = useSelector(userSelector);

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axiosAuth.post("/api/getPlaylists", {
          user_id: user.user_id,
        });

        const refinedResponse = response.data.playlist_details;
        setCollection(refinedResponse);
      } catch (error) {
        setError(true);
        console.error("Error fetching User Playlists", error);
      } finally {
        setLoading(false);
      }
    };
    if (!enabled) return;
    if (user) fetchUserPlaylists();
  }, [enabled, user]);

  return { loading, error, collection };
};

export default useFetchUserPlaylists;
