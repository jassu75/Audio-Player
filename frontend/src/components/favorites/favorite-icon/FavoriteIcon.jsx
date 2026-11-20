import { IconButton } from "@mui/material";
import BorderHeartIcon from "@mui/icons-material/FavoriteBorder";
import styles from "./favoriteIcon.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";

import FilledHeartIcon from "@mui/icons-material/Favorite";
import { favoritesSelector } from "../../../redux/selectors/userPreferencesSelectors.js";
import useUpdateFavorites from "../../../pages/favorites/hooks/useUpdateFavorites";
const FavoriteIcon = ({ songId }) => {
  const favorites = useSelector(favoritesSelector);
  const isFavorite = favorites?.includes(songId) ?? false;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { addFavoriteId, deleteFavoriteId } = useUpdateFavorites();

  const handleFavoriteIconClick = async (event) => {
    event.stopPropagation();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      if (isFavorite) await deleteFavoriteId(songId);
      else await addFavoriteId(songId);
    } catch {
      setError("Unable to update favorite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton onClick={handleFavoriteIconClick} disabled={loading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite} title={error || undefined}>
      {isFavorite ? (
        <FilledHeartIcon />
      ) : (
        <BorderHeartIcon className={styles.unfavorite_icon} />
      )}
    </IconButton>
  );
};

export default FavoriteIcon;
