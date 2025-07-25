import { Grid2, Pagination, Typography } from "@mui/material";
import useFetchFavorites from "../../hooks/Favorites/useFetchFavorites";
import styles from "./favoritesList.module.css";
import FavoriteCard from "./FavoriteCard";
import { useDispatch, useSelector } from "react-redux";
import { songsSelector } from "../../redux/selectors/homepage.selector";
import { favoritesSelector } from "../../redux/selectors/userPreferences.selector";
import { useEffect } from "react";
import { setSongs } from "../../redux/slices/homepage.slice";
import FavoriteSkeleton from "../../Skeletons/FavoriteSkeleton";
import ErrorPage from "../../HelperPages/ErrorPages/ErrorPage";
import EmptyHomePage from "../../HelperPages/EmptyPages/EmptyHomepage";
import useFetchUserDetails from "../../hooks/useFetchUserDetails";
import useFetchFavoriteIds from "../../hooks/Favorites/useFetchFavoriteIds";
import { useSearchParams } from "react-router-dom";

const FavoritesList = () => {
  const { userLoading, userError } = useFetchUserDetails();
  const { favoritesError, favoritesLoading } = useFetchFavorites();
  const { favoritesIdLoading, favoritesIdError } = useFetchFavoriteIds();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const start = (page - 1) * 20;
  const end = start + 20;

  const songsList = useSelector(songsSelector);
  const favorites = useSelector(favoritesSelector);

  const dispatch = useDispatch();

  const handleSetPage = (_event, value) => {
    setSearchParams({ page: value }, { replace: true });
  };

  useEffect(() => {
    if (songsList && favorites) {
      const filteredSongList = songsList.filter((favorite) =>
        favorites.includes(favorite.song_id)
      );

      dispatch(setSongs(filteredSongList));
    }
  }, [favorites, dispatch]);

  if (favoritesLoading || userLoading || favoritesIdLoading || !songsList)
    return <FavoriteSkeleton />;
  if (favoritesError || userError || favoritesIdError) return <ErrorPage />;

  return (
    <Grid2 className={styles.favorite_songs}>
      <Grid2 className={styles.title}>
        <Typography variant="HomepageTitleText" className={styles.title_text}>
          Songs in Favorites
        </Typography>
      </Grid2>
      <Grid2 className={styles.songs_container}>
        {songsList.length > 0 ? (
          <>
            <Grid2 className={styles.favorites_container}>
              {songsList?.slice(start, end).map((favorite) => (
                <FavoriteCard key={favorite.song_id} favorite={favorite} />
              ))}
            </Grid2>
            <Pagination
              variant="outlined"
              count={Math.ceil(Object.keys(favorites).length / 20)}
              page={page}
              onChange={handleSetPage}
            />
          </>
        ) : (
          <EmptyHomePage />
        )}
      </Grid2>
    </Grid2>
  );
};
export default FavoritesList;
