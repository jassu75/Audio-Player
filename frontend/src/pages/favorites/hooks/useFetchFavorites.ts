import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { userSelector } from "../../../redux/selectors/homepageSelectors";
import { setViewingSongList } from "../../../redux/slices/audioPlayerSlice";
import { postApi } from "../../../services/api";
import { indexSongs } from "../../../utils/songs";
import type { SongMap } from "../../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
const useFetchFavorites = () => {
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState(false);
  const [favoriteSongs, setFavoriteSongs] = useState<SongMap | null>(null);
  const dispatch = useAppDispatch();
  const userId = useAppSelector(userSelector)?.user_id;
  useEffect(() => {
    if (!userId) return;
    let active = true;
    const fetchFavorites = async () => {
      setFavoritesLoading(true);
      setFavoritesError(false);
      dispatch(setViewingSongList(null));
      try {
        const response = await postApi("/api/fetchfavorites", {
          user_id: userId,
        });
        const songs = indexSongs(
          (response.data?.favorites ?? []).map((favorite) => favorite.song),
        );
        if (active) {
          setFavoriteSongs(songs);
          dispatch(setViewingSongList(songs));
        }
      } catch (error) {
        if (active) setFavoritesError(true);
        console.error("Error fetching favorites", error);
      } finally {
        if (active) setFavoritesLoading(false);
      }
    };
    fetchFavorites();
    return () => {
      active = false;
    };
  }, [dispatch, userId]);
  return { favoritesLoading, favoritesError, favoriteSongs };
};
export default useFetchFavorites;
