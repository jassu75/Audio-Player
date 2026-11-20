import BorderHeartIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import type { FavoriteIconProps } from "./types/FavoriteIcon.types";
import styles from "./favoriteIcon.module.css";
import FilledHeartIcon from "@mui/icons-material/Favorite";
import useUpdateFavorites from "../../../pages/favorites/hooks/useUpdateFavorites";
import { favoritesSelector } from "../../../redux/selectors/userPreferencesSelectors";
const FavoriteIcon = ({ songId }: FavoriteIconProps) => {
    const favorites = useAppSelector(favoritesSelector);
    const isFavorite = favorites?.includes(songId) ?? false;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { addFavoriteId, deleteFavoriteId } = useUpdateFavorites();
    const handleFavoriteIconClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (loading)
            return;
        setLoading(true);
        setError("");
        try {
            if (isFavorite)
                await deleteFavoriteId(songId);
            else
                await addFavoriteId(songId);
        }
        catch {
            setError("Unable to update favorite. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (<IconButton onClick={handleFavoriteIconClick} disabled={loading} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"} aria-pressed={isFavorite} title={error || undefined}>
      {isFavorite ? (<FilledHeartIcon />) : (<BorderHeartIcon className={styles.unfavorite_icon}/>)}
    </IconButton>);
};
export default FavoriteIcon;
