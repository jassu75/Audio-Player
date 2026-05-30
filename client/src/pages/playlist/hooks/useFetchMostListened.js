import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../../redux/selectors/homepage.selector";
import { setViewingSonglist } from "../../../redux/slices/audioplayer.slice";

const useFetchMostListened = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;

    const fetchMostListened = async () => {
      try {
        setLoading(true);
        setError(false);
        dispatch(setViewingSonglist(null));
        const response = await axios.post(
          "/api/fetchMostListened",
          { user_id: user.user_id },
          { headers: { "Content-Type": "application/json" } },
        );
        const refinedResponse = response.data?.most_listened?.reduce(
          (acc, song) => {
            acc[song.song_id] = song;
            return acc;
          },
          {},
        );
        dispatch(setViewingSonglist(refinedResponse));
      } catch (error) {
        console.error("error fetching most listened", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMostListened();
  }, [dispatch, user]);

  return { loading, error };
};

export default useFetchMostListened;
