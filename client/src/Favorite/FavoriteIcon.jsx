import { IconButton } from "@mui/material";
import BorderHeartIcon from "@mui/icons-material/FavoriteBorder";
import styles from "./favoriteIcon.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";

import FilledHeartIcon from "@mui/icons-material/Favorite";
import { favoritesSelector } from "../redux/selectors/userPrefs.selector";
import useFavorites from "../hooks/useFavorites";
const FavoriteIcon = ({ songId }) => {
  const favorites = useSelector(favoritesSelector);
  const [isFavorite, setIsFavorite] = useState(() =>
    favorites?.includes(songId)
  );

  const { updateFavorite } = useFavorites();

  const handleFavoriteIconClick = () => {
    const prevValue = isFavorite;
    setIsFavorite(!prevValue);
    if (!prevValue) {
      const newFavorites = [...(favorites ?? []), songId];
      updateFavorite(newFavorites);
    } else {
      const newFavorites = favorites.filter((id) => id !== songId);
      updateFavorite(newFavorites);
    }
  };
  return (
    <IconButton onClick={handleFavoriteIconClick}>
      {isFavorite ? (
        <FilledHeartIcon />
      ) : (
        <BorderHeartIcon className={styles.unfavorite_icon} />
      )}
    </IconButton>
  );
};

export default FavoriteIcon;
