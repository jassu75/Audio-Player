import axios from "axios";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { recentlyPlayedSelector } from "../../redux/selectors/userPreferences.selector";

const useUpdateRecentlyPlayed = () => {
  const recentlyPlayed = useSelector(recentlyPlayedSelector);
  const recentlyPlayedRef = useRef(recentlyPlayed);

  useEffect(() => {
    recentlyPlayedRef.current = recentlyPlayed;
  }, [recentlyPlayed]);

  useEffect(() => {
    const updateRecentlyPlayed = async () => {
      try {
        const data = recentlyPlayedRef.current
          .filter((song) => song.last_played)
          .map((song) => ({
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
          }));

        await axios.post(
          "/api/updaterecentlyplayed",
          { data },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        console.error("Failed to update recently played", error);
      }
    };

    const intervalId = setInterval(updateRecentlyPlayed, 10 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
      updateRecentlyPlayed();
    };
  }, []);
};

export default useUpdateRecentlyPlayed;
