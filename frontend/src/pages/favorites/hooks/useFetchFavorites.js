import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { userSelector } from "../../../redux/selectors/homepageSelectors.js";
import { setViewingSongList } from "../../../redux/slices/audioPlayerSlice.js";
import { indexSongs } from "../../../utils/songs";

const useFetchFavorites = () => {
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector(userSelector)?.user_id;

  useEffect(() => {
    if (!userId) return;
    let active = true;
    const fetchFavorites = async () => {
      setFavoritesLoading(true);
      setFavoritesError(false);
      dispatch(setViewingSongList(null));
      try {
        const response = await axios.post("/api/fetchfavorites", { user_id: userId });
        const songs = indexSongs((response.data?.favorites ?? []).map((favorite) => favorite.song));
        if (active) dispatch(setViewingSongList(songs));
      } catch (error) {
        if (active) setFavoritesError(true);
        console.error("Error fetching favorites", error);
      } finally {
        if (active) setFavoritesLoading(false);
      }
    };
    fetchFavorites();
    return () => { active = false; };
  }, [dispatch, userId]);

  return { favoritesLoading, favoritesError };
};

export default useFetchFavorites;
