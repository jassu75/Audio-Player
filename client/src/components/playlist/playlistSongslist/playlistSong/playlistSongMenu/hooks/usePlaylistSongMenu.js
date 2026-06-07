import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { deleteViewingSong } from "../../../../../../redux/slices/audioplayer.slice";

const usePlaylistSongMenu = ({ song, playlistId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);

  const dispatch = useDispatch();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  const closeRenameModal = () => setRenameLoading(false);

  const closeMoveModal = () => setMoveLoading(false);

  const handleDeleteSong = async () => {
    setDeleteLoading(true);

    try {
      const assets = [
        { id: song.cover_art_id, type: "image" },
        { id: song.audio_url_id, type: "video" },
      ].filter((asset) => asset.id !== "static");

      await axios.post(
        "/api/deletesong",
        {
          song_id: song.song_id,
          assets,
          playlist_id: playlistId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      dispatch(deleteViewingSong(song.song_id));
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

  const handleMove = () => {
    setMoveLoading(true);
    handleMenuClose();
  };

  return {
    anchorEl,
    deleteLoading,
    renameLoading,
    moveLoading,
    handleMenuOpen,
    handleMenuClose,
    handleDeleteSong,
    handleRenameSong,
    handleMove,
    closeRenameModal,
    closeMoveModal,
  };
};

export default usePlaylistSongMenu;
