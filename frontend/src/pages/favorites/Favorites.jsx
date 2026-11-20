import { Grid2, Pagination, Typography } from "@mui/material";
import useFetchFavorites from "./hooks/useFetchFavorites";
import styles from "./favorites.module.css";
import { useDispatch, useSelector } from "react-redux";
import { viewingSongListSelector } from "../../redux/selectors/audioPlayerSelectors.js";
import { favoritesSelector } from "../../redux/selectors/userPreferencesSelectors.js";
import { useEffect } from "react";
import { setViewingSongList } from "../../redux/slices/audioPlayerSlice.js";
import FavoriteSkeleton from "../../components/skeletons/favorites/FavoriteSkeleton";
import Error from "../helpers/error/Error";
import useFetchFavoriteIds from "./hooks/useFetchFavoriteIds";
import usePagination from "../../hooks/usePagination";
import FavoriteCard from "../../components/favorites/favorite-card/FavoriteCard";
import EmptySongsList from "../../components/helpers/empty-state/empty-playlist/EmptySongsList";

const Favorites = () => {
  const { favoritesError, favoritesLoading } = useFetchFavorites();
  const { favoritesIdLoading, favoritesIdError } = useFetchFavoriteIds();
  const songsList = useSelector(viewingSongListSelector);
  const favorites = useSelector(favoritesSelector);

  const dispatch = useDispatch();

  const { page, pageCount, start, end, handlePageChange } = usePagination(
    Object.keys(songsList ?? {}).length,
  );

  useEffect(() => {
    if (songsList && favorites) {
      const filteredSongList = Object.values(songsList).reduce((acc, song) => {
        if (favorites.includes(song.song_id)) {
          acc[song.song_id] = song;
        }

        return acc;
      }, {});

      if (Object.keys(filteredSongList).length !== Object.keys(songsList).length) {
        dispatch(setViewingSongList(filteredSongList));
      }
    }
  }, [favorites, songsList, dispatch]);

  if (favoritesError || favoritesIdError) return <Error />;
  if (favoritesLoading || favoritesIdLoading || !songsList)
    return <FavoriteSkeleton />;
  if (Object.keys(songsList).length === 0) return <EmptySongsList />;

  return (
    <Grid2 className={styles.favorite_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Songs in Favorites
        </Typography>
      </Grid2>
      <Grid2 className={styles.songs_container}>
        <Grid2 className={styles.favorites_container}>
          {Object.values(songsList)
            .slice(start, end)
            .map((song) => (
              <FavoriteCard
                key={song.song_id}
                songKey={song.song_id}
                favorite={song}
              />
            ))}
        </Grid2>
        <Pagination
          variant="outlined"
          count={pageCount}
          page={page}
          onChange={handlePageChange}
        />
      </Grid2>
    </Grid2>
  );
};
export default Favorites;
