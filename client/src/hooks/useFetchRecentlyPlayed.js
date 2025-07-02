import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../redux/selectors/homepage.selector";
import { setRecentlyPlayed } from "../redux/slices/userPreferences.slice";
import { recentlyPlayedSelector } from "../redux/selectors/userPreferences.selector";

const useFetchRecentlyPlayed = () => {
  const [recentlyPlayedLoading, setRecentlyPlayedLoading] = useState(false);
  const [recentlyPlayedError, setRecentlyPlayedError] = useState(false);
  const user = useSelector(userSelector);
  const recentlyPlayed = useSelector(recentlyPlayedSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        setRecentlyPlayedLoading(true);
        setRecentlyPlayedError(false);
        const response = await axios.post(
          "/api/fetchrecentlyplayed",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const refinedResponse = response.data?.recently_played;
        dispatch(setRecentlyPlayed(refinedResponse));
      } catch (error) {
        console.error("error fetching recently played", error);
        setRecentlyPlayedError(true);
      } finally {
        setRecentlyPlayedLoading(false);
      }
    };

    if (!recentlyPlayed && user) {
      fetchRecentlyPlayed();
    }
  }, [dispatch, user, recentlyPlayed]);

  return { recentlyPlayedLoading, recentlyPlayedError };
};

export default useFetchRecentlyPlayed;
