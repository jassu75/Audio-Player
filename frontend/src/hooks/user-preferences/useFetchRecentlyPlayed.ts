import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { userSelector } from "../../redux/selectors/homepageSelectors";
import { recentlyPlayedSelector } from "../../redux/selectors/userPreferencesSelectors";
import { setRecentlyPlayed } from "../../redux/slices/userPreferencesSlice";
import { postApi } from "../../services/api";
import { waitForPendingPlays } from "../../services/listeningHistory";
const useFetchRecentlyPlayed = () => {
  const [recentlyPlayedLoading, setRecentlyPlayedLoading] = useState(false);
  const [recentlyPlayedError, setRecentlyPlayedError] = useState(false);
  const user = useAppSelector(userSelector);
  const recentlyPlayed = useAppSelector(recentlyPlayedSelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    let active = true;
    const fetchRecentlyPlayed = async () => {
      if (!user) return;
      try {
        setRecentlyPlayedLoading(true);
        setRecentlyPlayedError(false);
        await waitForPendingPlays(user.user_id);
        if (!active) return;
        const response = await postApi(
          "/api/fetchrecentlyplayed",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        if (active)
          dispatch(setRecentlyPlayed(response.data?.recently_played ?? []));
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
    return () => {
      active = false;
    };
  }, [dispatch, user, recentlyPlayed]);
  return { recentlyPlayedLoading, recentlyPlayedError };
};
export default useFetchRecentlyPlayed;
