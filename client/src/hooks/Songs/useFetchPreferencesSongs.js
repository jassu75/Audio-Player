import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  jamendoSongsSelector,
  songsSelector,
  userSelector,
} from "../../redux/selectors/homepage.selector";
import axios from "axios";
import { setSongs } from "../../redux/slices/homepage.slice";
import { recentlyPlayedSelector } from "../../redux/selectors/userPreferences.selector";
import { setRecentlyPlayed } from "../../redux/slices/userPreferences.slice";

const useFetchPreferenceSongs = (preference) => {
  const [songsLoading, setSongsLoading] = useState(false);
  const [songsError, setSongsError] = useState(false);
  const user = useSelector(userSelector);
  const songsList = useSelector(songsSelector);
  const recentlyPlayed = useSelector(recentlyPlayedSelector);
  const popular = useSelector(jamendoSongsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setSongsLoading(true);
        setSongsError(false);
        const response = await axios.post(
          "/api/fetchfavorites",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const refinedResponse = response.data?.favorites?.reduce(
          (acc, favorite) => {
            acc[favorite.song.song_id] = favorite.song;

            return acc;
          },
          {}
        );
        dispatch(setSongs(refinedResponse));
      } catch (error) {
        console.error("error fetching favoriteIds", error);
        setSongsError(false);
      } finally {
        setSongsLoading(false);
      }
    };

    const fetchMostListened = async () => {
      try {
        setSongsLoading(true);
        setSongsError(false);
        const response = await axios.post(
          "/api/fetchMostListened",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const refinedResponse = response.data?.most_listened?.reduce(
          (acc, song) => {
            acc[song.song_id] = song;
            return acc;
          },
          {}
        );
        dispatch(setSongs(refinedResponse));
      } catch (error) {
        console.error("error fetching most listened", error);
        setSongsError(true);
      } finally {
        setSongsLoading(false);
      }
    };

    const fetchRecents = async () => {
      try {
        setSongsLoading(true);
        setSongsError(false);
        const response = await axios.post(
          "/api/fetchrecentlyplayed",
          { user_id: user.user_id },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const refinedResponse = response.data?.recently_played;
        dispatch(setRecentlyPlayed(refinedResponse));
        dispatch(setSongs(refinedResponse));
      } catch (error) {
        console.error("error fetching recently played", error);
        setSongsError(true);
      } finally {
        setSongsLoading(false);
      }
    };

    const fetchPopular = () => {
      dispatch(setSongs(popular));
    };

    if (!songsList && user && preference === "favorites") {
      fetchFavorites();
    } else if (!songsList && user && preference === "mostPlayed") {
      fetchMostListened();
    } else if (
      !songsList &&
      user &&
      preference === "recents" &&
      recentlyPlayed
    ) {
      fetchRecents();
    } else if (!songsList && user && preference === "popular" && popular) {
      fetchPopular();
    }
  }, [user, songsList, dispatch, preference, recentlyPlayed, popular]);

  return { songsLoading, songsError };
};

export default useFetchPreferenceSongs;
