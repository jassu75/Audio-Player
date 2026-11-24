import { useState } from "react";
import axiosAuth from "../../../../config/axiosAuth";
import { useAppDispatch } from "../../../../redux/hooks";
import { deletePlaylist } from "../../../../redux/slices/homepageSlice";
const usePlaylistRailItem = () => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState<"delete" | "rename" | null>(null);
  const [cantDeleteModal, setCantDeleteModal] = useState(false);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      setLoading("delete");
      await axiosAuth.post("/api/deletePlaylist", { playlist_id: playlistId });
      dispatch(deletePlaylist(playlistId));
    } catch (error) {
      setCantDeleteModal(true);
      console.error("Error deleting Playlist", error);
    } finally {
      setLoading(null);
      handleMenuClose();
    }
  };
  const handleRenamePlaylist = () => {
    setLoading("rename");
    handleMenuClose();
  };
  const closeRenameModal = () => setLoading(null);
  return {
    anchorEl,
    loading,
    cantDeleteModal,
    setCantDeleteModal,
    handleMenuOpen,
    handleMenuClose,
    handleDeletePlaylist,
    handleRenamePlaylist,
    closeRenameModal,
  };
};
export default usePlaylistRailItem;
