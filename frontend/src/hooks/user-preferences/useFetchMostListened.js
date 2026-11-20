import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../redux/selectors/homepageSelectors.js";
import { viewingSongListSelector } from "../../redux/selectors/audioPlayerSelectors.js";

import { setViewingSongList } from "../../redux/slices/audioPlayerSlice.js";

const useFetchMostListened = () => {
  const [mostListenedLoading, setMostListenedLoading] = useState(false);
  const [mostListenedError, setMostListenedError] = useState(false);
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const songsList = useSelector(viewingSongListSelector);
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
        dispatch(setViewingSongList(refinedResponse));
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
