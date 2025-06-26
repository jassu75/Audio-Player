import axios from "axios";
import { useEffect, useRef } from "react";
import { auth } from "../config/firebase";
import { useSelector } from "react-redux";
import { recentlyPlayedSelector } from "../redux/selectors/userPreferences.selector";

const useRecentlyPlayed = () => {
  const recentlyPlayed = useSelector(recentlyPlayedSelector);
  const recentlyPlayedRef = useRef(recentlyPlayed);

  useEffect(() => {
    recentlyPlayedRef.current = recentlyPlayed;
  }, [recentlyPlayed]);

  useEffect(() => {
    const updateRecentlyPlayed = async () => {
      try {
        await axios.post(
          "/api/updaterecentlyplayed",
          {
            user_id: auth.currentUser?.uid,
            recently_played: recentlyPlayedRef.current,
          },
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

export default useRecentlyPlayed;
