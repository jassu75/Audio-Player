import { useState } from "react";
import { useDispatch } from "react-redux";
import axiosAuth from "../../../../config/axiosAuth";
import deletePlaylistDetails from "../../../../redux/slices/homepage.slice";

const usePlaylistRailItem = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(null);
  const [cantDeleteModal, setCantDeleteModal] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDeletePlaylist = async (playlistId) => {
    try {
      setLoading("delete");

      await axiosAuth.post("/api/deletePlaylist", { playlist_id: playlistId });
      dispatch(deletePlaylistDetails(playlistId));
    } catch (error) {
      setCantDeleteModal(true);
      console.error("Error deleting Playlist", error);
    } finally {
      setLoading(null);
      handleMenuClose();
    }
  };

  const handleRenameSong = () => {
    setLoading("rename");
    handleMenuClose();
  };

  return {
    anchorEl,
    loading,
    cantDeleteModal,
    setCantDeleteModal,
    handleMenuOpen,
    handleMenuClose,
    handleDeletePlaylist,
    handleRenameSong,
  };
};

export default usePlaylistRailItem;
