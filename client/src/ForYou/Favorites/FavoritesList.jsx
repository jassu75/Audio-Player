import { Grid2, Typography } from "@mui/material";
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

const FavoritesList = () => {
  const { userLoading, userError } = useFetchUserDetails();
  const { favoritesError, favoritesLoading } = useFetchFavorites();
  const { favoritesIdLoading, favoritesIdError } = useFetchFavoriteIds();
  const songsList = useSelector(songsSelector);
  const favorites = useSelector(favoritesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (songsList && favorites) {
      const filteredSongList = Object.fromEntries(
        Object.entries(songsList).filter(([favoriteId]) =>
          favorites.includes(favoriteId)
        )
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

      {Object.keys(songsList).length > 0 ? (
        <Grid2 className={styles.favorites_container}>
          {Object.entries(songsList).map(([id, favorite]) => (
            <FavoriteCard key={id} favorite={favorite} />
          ))}
        </Grid2>
      ) : (
        <EmptyHomePage />
      )}
    </Grid2>
  );
};
export default FavoritesList;
