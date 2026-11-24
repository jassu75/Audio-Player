import BorderHeartIcon from "@mui/icons-material/FavoriteBorder";
import FilledHeartIcon from "@mui/icons-material/Favorite";
import { IconButton, Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import type { FavoriteIconProps } from "./types/FavoriteIcon.types";
import styles from "./favoriteIcon.module.css";
import useUpdateFavorites from "../../../pages/favorites/hooks/useUpdateFavorites";
import { favoritesSelector } from "../../../redux/selectors/userPreferencesSelectors";
import { finishFavoriteUpdate } from "../../../redux/slices/userPreferencesSlice";

const FavoriteIcon = ({ songId }: FavoriteIconProps) => {
  const favorites = useAppSelector(favoritesSelector);
  const update = useAppSelector(
    (state) => state.userPrefs.favoriteUpdates[songId],
  );
  const dispatch = useAppDispatch();
  const isFavorite = update?.isFavorite ?? favorites?.includes(songId) ?? false;
  const { toggleFavorite } = useUpdateFavorites();
  const handleFavoriteIconClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    void toggleFavorite(songId).catch(() => {});
  };
  const dismissError = () => {
    if (update && !update.pending)
      dispatch(finishFavoriteUpdate({ songId, requestId: update.requestId }));
  };
  return (
    <>
      <IconButton
        onClick={handleFavoriteIconClick}
        aria-busy={update?.pending || undefined}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
        title={update?.error}
      >
        {isFavorite ? (
          <FilledHeartIcon />
        ) : (
          <BorderHeartIcon className={styles.unfavorite_icon} />
        )}
      </IconButton>
      <Snackbar
        open={Boolean(update?.error)}
        autoHideDuration={6000}
        onClose={dismissError}
        onClick={(event) => event.stopPropagation()}
        message={update?.error}
      />
    </>
  );
};

export default FavoriteIcon;
