import { Grid, Pagination, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import FavoriteCard from "../../components/favorites/favorite-card/FavoriteCard";
import EmptySongsList from "../../components/helpers/empty-state/empty-playlist/EmptySongsList";
import FavoriteSkeleton from "../../components/skeletons/favorites/FavoriteSkeleton";
import usePagination from "../../hooks/usePagination";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { favoritesSelector } from "../../redux/selectors/userPreferencesSelectors";
import { setViewingSongList } from "../../redux/slices/audioPlayerSlice";
import { indexSongs } from "../../utils/songs";
import Error from "../helpers/error/Error";
import styles from "./favorites.module.css";
import useFetchFavoriteIds from "./hooks/useFetchFavoriteIds";
import useFetchFavorites from "./hooks/useFetchFavorites";
import BackButton from "../../components/helpers/back-button/BackButton";
const Favorites = () => {
  const { favoritesError, favoritesLoading, favoriteSongs } =
    useFetchFavorites();
  const { favoritesIdLoading, favoritesIdError } = useFetchFavoriteIds();
  const favorites = useAppSelector(favoritesSelector);
  const updates = useAppSelector((state) => state.userPrefs.favoriteUpdates);
  const visibleSongs = useMemo(() => {
    if (!favoriteSongs || !favorites) return null;
    return Object.values(favoriteSongs).filter(
      (song) =>
        updates[song.song_id]?.isFavorite ?? favorites.includes(song.song_id),
    );
  }, [favoriteSongs, favorites, updates]);
  const dispatch = useAppDispatch();
  const { pageCount, start, end, handlePageChange, page } = usePagination(
    visibleSongs?.length ?? 0,
  );
  useEffect(() => {
    if (visibleSongs) dispatch(setViewingSongList(indexSongs(visibleSongs)));
  }, [visibleSongs, dispatch]);
  if (favoritesError || favoritesIdError) return <Error />;
  if (favoritesLoading || favoritesIdLoading || !visibleSongs)
    return <FavoriteSkeleton />;
  if (visibleSongs.length === 0) return <EmptySongsList />;
  return (
    <>
      <BackButton />
      <Grid className={styles.favorite_songs}>
        <Grid className={styles.title}>
          <Typography variant="HomepageTitleText" className={styles.title_text}>
            Songs in Favorites
          </Typography>
        </Grid>
        <Grid className={styles.songs_container}>
          <Grid className={styles.favorites_container}>
            {visibleSongs.slice(start, end).map((song) => (
              <FavoriteCard
                key={song.song_id}
                songKey={song.song_id}
                favorite={song}
              />
            ))}
          </Grid>
          <Pagination
            variant="outlined"
            count={pageCount}
            page={page}
            onChange={handlePageChange}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default Favorites;
