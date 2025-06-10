import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import styles from "./homepageSong.module.css";
import Grid2 from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { setHomepageSongTitles } from "./homepage.slice";
import CircularProgress from "@mui/material/CircularProgress"; // Import the loader
import axios from "axios";

const HomepageSong = ({ songKey, song }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.homepage.user);

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
      const updatedHomepageSongs = user.homepage_songs.filter(
        (songTitle) => songTitle !== songKey
      );
      await axios.post(
        "/api/updateHomepageSong",
        {
          user_id: user.id,
          homepage_songs: updatedHomepageSongs,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch(setHomepageSongTitles(updatedHomepageSongs));
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
                <Typography variant="MenuItemText">Deleting</Typography>
                <CircularProgress className={styles.loader} size={20} />
              </>
            ) : (
              <Typography variant="MenuItemText">Delete</Typography>
            )}
          </MenuItem>
        </Menu>
      </Grid2>
    </Grid2>
  );
};

export default HomepageSong;
