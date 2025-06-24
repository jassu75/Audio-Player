import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import styles from "./playlistSong.module.css";
import Grid2 from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSong,
  setPlaylistSongs,
} from "../../redux/slices/homepage.slice";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { playlistsSelector } from "../../redux/selectors/homepage.selector";
import { Divider } from "@mui/material";
import RenameSongTitle from "./RenameSongTitle";
import FavoriteIcon from "../../Favorite/FavoriteIcon";

const PlaylistSong = ({ playlistId, songKey, song }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const dispatch = useDispatch();
  const allPlaylistSongs = useSelector(playlistsSelector);
  const playlistSongs = allPlaylistSongs[playlistId]?.playlist_songs;
  const playlistSongList = Array.from(playlistSongs);

  const handleSongClick = () => {
    navigate(`/user/playlist/${playlistId}/song/${songKey}?list=playlist`);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteSong = async () => {
    setDeleteLoading(true);
    try {
      const updatedPlaylistSongs = playlistSongList.filter(
        (songId) => songId !== songKey
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
      const assets = [
        { id: song.cover_art_id, type: "image" },
        { id: song.audio_url_id, type: "video" },
      ].filter((asset) => asset.id !== "static");

      await axios.post(
        "/api/deletesong",
        {
          songIds: [songKey],
          assets: assets,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(deleteSong(songKey));
    } catch (error) {
      console.error("Error deleting song:", error);
    } finally {
      setDeleteLoading(false);
      handleMenuClose();
    }
  };

  const handleRenameSong = () => {
    setRenameLoading(true);
    handleMenuClose();
  };
  const closeRenameModal = () => setRenameLoading(false);

  return (
    <>
      <Grid2 className={styles.song_card}>
        <Grid2 className={styles.song_card_info} onClick={handleSongClick}>
          <img className={styles.song_image} src={song?.cover_art} alt="" />
          <Grid2 className={styles.song_content}>
            <Grid2 className={styles.song_title}>
              <Typography
                variant="homepageSongTitle"
                className={styles.song_title}
              >
                {song?.title}
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
          <FavoriteIcon songId={songKey} />
          <IconButton onClick={handleMenuOpen} className={styles.icon}>
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
            <MenuItem
              disabled={deleteLoading || renameLoading}
              onClick={handleRenameSong}
              className={styles.menu_item}
            >
              {renameLoading ? (
                <>
                  <Typography variant="MenuItemText">Renaming</Typography>
                  <CircularProgress className={styles.loader} size={20} />
                </>
              ) : (
                <Typography variant="MenuItemText">Rename</Typography>
              )}
            </MenuItem>
            <Divider className={styles.divider} />

            <MenuItem
              disabled={renameLoading || deleteLoading}
              onClick={handleDeleteSong}
              className={styles.menu_item}
            >
              {deleteLoading ? (
                <>
                  <Typography
                    variant="MenuItemText"
                    className={styles.delete_item_text}
                  >
                    Deleting
                  </Typography>
                  <CircularProgress className={styles.loader} size={20} />
                </>
              ) : (
                <Typography
                  variant="MenuItemText"
                  className={styles.delete_item_text}
                >
                  Delete
                </Typography>
              )}
            </MenuItem>
          </Menu>
        </Grid2>
      </Grid2>
      <RenameSongTitle
        open={renameLoading}
        onClose={closeRenameModal}
        songId={songKey}
        songTitle={song.title}
      />
    </>
  );
};

export default PlaylistSong;
