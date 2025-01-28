import Grid2 from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import styles from "./homepagePlaylistItem.module.css";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMutation } from "@apollo/client";
import { DELETE_PLAYLIST, UPDATE_PLAYLIST_IDS } from "../../mutations";
import { deletePlaylistDetails, setPlaylistIds } from "../HomepageSongs/homepage.slice";

const HomepagePlaylistItem = ({ playlistKey, playlistItem }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.homepage.user);
    const [deletePlaylist] = useMutation(DELETE_PLAYLIST);
    const [updatePlaylistIds] = useMutation(UPDATE_PLAYLIST_IDS);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeletePlaylist = async () => {
        setLoading(true);
        try {

            if (!playlistItem?.playlist_songs || playlistItem.playlist_songs.length === 0) {

                const updatedPlaylistIds = user.playlist_ids.filter(
                    (playlistId) => playlistId !== playlistKey
                );

                dispatch(setPlaylistIds(updatedPlaylistIds));

                dispatch(deletePlaylistDetails(playlistKey));

                await updatePlaylistIds({
                    variables: {
                        user_id: user.id,
                        playlist_ids: updatedPlaylistIds,
                    },
                });
                await deletePlaylist({ variables: { id: playlistKey } });

            }

        } catch (error) {
            console.error("Error deleting song:", error);
        }
        setLoading(false);
        handleMenuClose();
    };

    const handlePlaylistClick = () => {
        navigate(`/playlists/${playlistKey}`);
    };

    return (
        <div className={styles.playlist_card_container}>
            <div
                className={styles.playlist_card}
                onClick={handlePlaylistClick}
            >
                <img
                    className={styles.playlist_image}
                    src={playlistItem?.playlist_cover_art}
                    alt=""
                />
                <Grid2 className={styles.playlist_content}>
                    <Grid2 >
                        <Typography
                            variant="homepageSongTitle"
                            className={styles.playlist_title}
                        >
                            {playlistItem?.playlist_title}
                        </Typography>
                    </Grid2>
                </Grid2>
            </div>
            <Grid2 className={styles.playlist_actions}>
                <IconButton
                    onClick={handleMenuOpen}
                    sx={{ color: "White" }}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    slotProps={{
                        root: { sx: { ".MuiList-root": { padding: 0 } } },
                    }}
                >
                    <MenuItem onClick={handleDeletePlaylist} className={styles.menu_item}>
                        {loading ? (
                            <>
                                <Typography
                                    variant="MenuItemText"
                                    className={styles.menu_item_text}
                                >
                                    Deleting
                                </Typography>
                                <CircularProgress
                                    className={styles.loader}
                                    size={20}
                                />
                            </>
                        ) : (
                            <Typography
                                variant="MenuItemText"
                                className={styles.menu_item_text}
                            >
                                Delete
                            </Typography>
                        )}
                    </MenuItem>
                </Menu>
            </Grid2>
        </div>
    );
};

export default HomepagePlaylistItem;
