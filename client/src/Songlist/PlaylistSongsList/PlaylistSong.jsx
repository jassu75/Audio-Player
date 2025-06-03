import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import styles from "./PlaylistSong.module.css";
import Grid2 from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylistSongs } from "../HomepageSongs/homepage.slice";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const PlaylistSong = ({ playlistId, songKey, song }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const allPlaylistSongs = useSelector((state) => state.homepage.playlists);
  const playlistSongs = allPlaylistSongs[playlistId]?.playlist_songs;
  const playlistSongList = Array.from(playlistSongs);

  const handleSongClick = () => {
    navigate(`/user/song/${songKey}`);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteSong = async () => {
    setLoading(true);
    try {
      const updatedPlaylistSongs = playlistSongList.filter(
        (songTitle) => songTitle !== songKey
      );
      await axios.post(
        "/api/updatePlaylistSong",
        {
          playlist_id: playlistId,
          playlist_songs: updatedPlaylistSongs,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(
        setPlaylistSongs({
          id: playlistId,
          playlistSongs: updatedPlaylistSongs,
        })
      );
    } catch (error) {
      console.error("Error deleting song:", error);
    }
    setLoading(false);
    handleMenuClose();
  };

  return (
    <Grid2 className={styles.song_card}>
      <Grid2 className={styles.song_card_info} onClick={handleSongClick}>
        <img className={styles.song_image} src={song?.cover_art} alt="" />
        <Grid2 className={styles.song_content}>
          <Grid2 className={styles.song_title}>
            <Typography
              variant="homepageSongTitle"
              className={styles.song_title}
            >
              {songKey}
            </Typography>
          </Grid2>
          <Grid2 className={styles.song_artist}>
            <Typography
              variant="homepageSongArtist"
              className={styles.song_artist}
            >
              {song?.artist}
            </Typography>
          </Grid2>
        </Grid2>
      </Grid2>
      <Grid2 className={styles.song_actions}>
        <IconButton onClick={handleMenuOpen} sx={{ color: "White" }}>
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
          <MenuItem onClick={handleDeleteSong} className={styles.menu_item}>
            {loading ? (
              <>
                <Typography
                  variant="MenuItemText"
                  className={styles.menu_item_text}
                >
                  Deleting
                </Typography>
                <CircularProgress className={styles.loader} size={20} />
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
    </Grid2>
  );
};

export default PlaylistSong;
