import { IconButton } from "@mui/material";
import BorderHeartIcon from "@mui/icons-material/FavoriteBorder";
import styles from "./favoriteIcon.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";

import FilledHeartIcon from "@mui/icons-material/Favorite";
import { favoritesSelector } from "../redux/selectors/userPreferences.selector";
import useUpdateFavorites from "../hooks/Favorites/useUpdateFavorites";
const FavoriteIcon = ({ songId }) => {
  const favorites = useSelector(favoritesSelector);
  const [isFavorite, setIsFavorite] = useState(() =>
    favorites?.includes(songId)
  );

  const { addFavoriteId, deleteFavoriteId } = useUpdateFavorites();

  const handleFavoriteIconClick = (e) => {
    e.stopPropagation();
    const prevValue = isFavorite;
    setIsFavorite(!prevValue);
    if (!prevValue) {
      addFavoriteId(songId);
    } else {
      deleteFavoriteId(songId);
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
