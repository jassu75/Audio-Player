import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recentlyPlayedSelector } from "../../redux/selectors/userPreferences.selector";
import { userSelector } from "../../redux/selectors/homepage.selector";
import { setRecentlyPlayed } from "../../../redux/slices/userPreferences.slice";

const useFetchRecentlyPlayed = () => {
  const playlistTitle = "Audio in Recently Played";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const user = useSelector(userSelector);
  const recentlyPlayed = useSelector(recentlyPlayedSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.post(
          "/api/fetchrecentlyplayed",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        const refinedResponse = response.data?.recently_played?.reduce(
          (acc, song) => {
            acc[song.song_id] = song;
            return acc;
          },
          {},
        );
        dispatch(setRecentlyPlayed(refinedResponse));
      } catch (error) {
        console.error("error fetching recently played", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!recentlyPlayed && user) {
      fetchRecentlyPlayed();
    }
  }, [dispatch, user, recentlyPlayed]);

  return { loading, error, playlistTitle };
};

export default useFetchRecentlyPlayed;
