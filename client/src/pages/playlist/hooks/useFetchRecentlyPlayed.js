import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../../redux/selectors/homepage.selector";
import { setRecentlyPlayed } from "../../../redux/slices/userPreferences.slice";
import { setViewingSonglist } from "../../../redux/slices/audioplayer.slice";

const useFetchRecentlyPlayed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;

    const fetchRecentlyPlayed = async () => {
      try {
        setLoading(true);
        setError(false);
        dispatch(setViewingSonglist(null));
        const response = await axios.post(
          "/api/fetchrecentlyplayed",
          { user_id: user.user_id },
          { headers: { "Content-Type": "application/json" } },
        );
        const refinedResponse = response.data?.recently_played?.reduce(
          (acc, song) => {
            acc[song.song_id] = song;
            return acc;
          },
          {},
        );
        dispatch(setRecentlyPlayed(refinedResponse));
        dispatch(setViewingSonglist(refinedResponse));
      } catch (error) {
        console.error("error fetching recently played", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyPlayed();
  }, [dispatch, user]);

  return { loading, error };
};

export default useFetchRecentlyPlayed;
