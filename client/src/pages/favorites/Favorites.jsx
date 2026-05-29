import { Grid2, Pagination, Typography } from "@mui/material";
import useFetchFavorites from "../../hooks/Favorites/useFetchFavorites";
import styles from "./favorites.module.css";
import { useDispatch, useSelector } from "react-redux";
import { viewingSonglistSelector } from "../../redux/selectors/audioplayer.selector";
import { favoritesSelector } from "../../redux/selectors/userPreferences.selector";
import { useEffect } from "react";
import { setViewingSonglist } from "../../redux/slices/audioplayer.slice";
import FavoriteSkeleton from "../../Skeletons/FavoriteSkeleton";
import Error from "../helpers/error/Error";
import useFetchUserDetails from "../../hooks/useFetchUserDetails";
import useFetchFavoriteIds from "../../hooks/Favorites/useFetchFavoriteIds";
import { useSearchParams } from "react-router-dom";
import FavoriteCard from "../../components/favorites/favoritesCard/FavoriteCard";
import EmptySongslist from "../../components/helpers/emptySongslist/EmptySongslist";

const Favorites = () => {
  const { userLoading, userError } = useFetchUserDetails();
  const { favoritesError, favoritesLoading } = useFetchFavorites();
  const { favoritesIdLoading, favoritesIdError } = useFetchFavoriteIds();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const start = (page - 1) * 20;
  const end = start + 20;

  const songsList = useSelector(viewingSonglistSelector);
  const favorites = useSelector(favoritesSelector);

  const dispatch = useDispatch();

  const handleSetPage = (_event, value) => {
    setSearchParams({ page: value }, { replace: true });
  };

  useEffect(() => {
    if (songsList && favorites) {
      const filteredSongList = Object.values(songsList).reduce((acc, song) => {
        if (favorites.includes(song.song_id)) {
          acc[song.song_id] = song;
        }

        return acc;
      }, {});

      dispatch(setViewingSonglist(filteredSongList));
    }
  }, [favorites, dispatch]);

  if (favoritesLoading || userLoading || favoritesIdLoading || !songsList)
    return <FavoriteSkeleton />;
  if (favoritesError || userError || favoritesIdError) return <Error />;
  if (Object.keys(songsList).length === 0) return <EmptySongslist />;

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
          count={Math.ceil(Object.entries(songsList).length / 20)}
          page={page}
          onChange={handleSetPage}
        />
      </Grid2>
    </Grid2>
  );
};
export default Favorites;
