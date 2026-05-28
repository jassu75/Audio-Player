import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/homepage.selector";
import { viewingSonglistSelector } from "../../../redux/selectors/audioplayer.selector";
import { setViewingSonglist } from "../../../redux/slices/audioplayer.slice";

const useFetchMostListened = () => {
  const playlistTitle = "Audio in Most Listened";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const songslist = useSelector(viewingSonglistSelector);
  useEffect(() => {
    const fetchMostListened = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.post(
          "/api/fetchMostListened",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          },
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

    if (!songslist && user) {
      fetchMostListened();
    }
  }, [dispatch, user, songslist]);

  return { loading, error, playlistTitle };
};

export default useFetchMostListened;
