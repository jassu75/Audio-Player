import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/homepage.selector";
import { viewingSonglistSelector } from "../../redux/selectors/audioplayer.selector";

import { setViewingSonglist } from "../../redux/slices/audioplayer.slice";

const useFetchMostListened = () => {
  const [mostListenedLoading, setMostListenedLoading] = useState(false);
  const [mostListenedError, setMostListenedError] = useState(false);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const songsList = useSelector(viewingSonglistSelector);
  useEffect(() => {
    const fetchMostListened = async () => {
      try {
        setMostListenedLoading(true);
        setMostListenedError(false);
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
        setMostListenedError(true);
      } finally {
        setMostListenedLoading(false);
      }
    };

    if (!songsList && user) {
      fetchMostListened();
    }
  }, [dispatch, user, songsList]);

  return { mostListenedLoading, mostListenedError };
};

export default useFetchMostListened;
