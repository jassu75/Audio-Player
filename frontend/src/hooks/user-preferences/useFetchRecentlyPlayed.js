import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recentlyPlayedSelector } from "../../redux/selectors/userPreferencesSelectors.js";
import { userSelector } from "../../redux/selectors/homepageSelectors.js";
import { setRecentlyPlayed } from "../../redux/slices/userPreferencesSlice.js";

const useFetchRecentlyPlayed = () => {
  const [recentlyPlayedLoading, setRecentlyPlayedLoading] = useState(false);
  const [recentlyPlayedError, setRecentlyPlayedError] = useState(false);
  const user = useSelector(userSelector);
  const recentlyPlayed = useSelector(recentlyPlayedSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    let active = true;
    const fetchRecentlyPlayed = async () => {
      try {
        setRecentlyPlayedLoading(true);
        setRecentlyPlayedError(false);
        const response = await axios.post(
          "/api/fetchrecentlyplayed",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        if (active) dispatch(setRecentlyPlayed(response.data?.recently_played ?? []));
      } catch (error) {
        console.error("error fetching recently played", error);
        if (active) setRecentlyPlayedError(true);
      } finally {
        if (active) setRecentlyPlayedLoading(false);
      }
    };

    if (!recentlyPlayed && user) {
      fetchRecentlyPlayed();
    }
    return () => { active = false; };
  }, [dispatch, user, recentlyPlayed]);

  return { recentlyPlayedLoading, recentlyPlayedError };
};

export default useFetchRecentlyPlayed;
