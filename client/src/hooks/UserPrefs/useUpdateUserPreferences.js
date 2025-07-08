import axios from "axios";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  listensSelector,
  recentlyPlayedSelector,
} from "../../redux/selectors/userPreferences.selector";

const useUpdateUserPreference = () => {
  const recentlyPlayed = useSelector(recentlyPlayedSelector);
  const recentlyPlayedRef = useRef(recentlyPlayed);

  const listens = useSelector(listensSelector);
  const listensRef = useRef(listens);

  useEffect(() => {
    recentlyPlayedRef.current = recentlyPlayed;
    listensRef.current = listens;
  }, [recentlyPlayed, listens]);

  useEffect(() => {
    const updateUserPref = async () => {
      try {
        const data = recentlyPlayedRef.current
          .filter((song) => song.last_played)
          .map((song) => {
            const listenCount = listensRef.current?.[song.song_id] || 0;

            return {
              where: {
                song_id: { _eq: song.song_id },
                _or: [
                  { last_played: { _is_null: true } },
                  { last_played: { _neq: song.last_played } },
                ],
              },
              _set: {
                last_played: song.last_played,
              },
              _inc: {
                listens: listenCount,
              },
            };
          });

        await axios.post(
          "/api/updateUserPreference",
          { data },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        console.error("Failed to update user preference", error);
      }
    };

    const callUpdateUserPreference = () => {
      if (recentlyPlayedRef.current && listensRef.current) {
        updateUserPref();
      }
    };

    const intervalId = setInterval(callUpdateUserPreference, 10 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
      callUpdateUserPreference();
    };
  }, []);
};

export default useUpdateUserPreference;
