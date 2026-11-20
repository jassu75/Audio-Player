import { useState } from "react";
import { useAppDispatch } from "../../../../../../redux/hooks";
import { deleteSong } from "../../../../../../redux/slices/audioPlayerSlice";
import { postApi } from "../../../../../../services/api";
import type { PlaylistSongMenuProps } from "../types/PlaylistSongMenu.types";
import type { Asset } from "../../../../../../hooks/cloudinary/types/useCloudinaryUpload.types";
const usePlaylistSongMenu = ({ song, playlistId }: PlaylistSongMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const [moveLoading, setMoveLoading] = useState(false);
    const dispatch = useAppDispatch();
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const closeRenameModal = () => setRenameLoading(false);
    const closeMoveModal = () => setMoveLoading(false);
    const handleDeleteSong = async () => {
        setDeleteLoading(true);
        try {
            const assets: Asset[] = [
                { id: song.cover_art_id, type: "image" },
                { id: song.audio_url_id, type: "video" },
            ].filter((asset): asset is Asset => Boolean(asset.id && asset.id !== "static"));
            await postApi("/api/deletesong", {
                song_id: song.song_id,
                assets,
                playlist_id: playlistId,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            dispatch(deleteSong(song.song_id));
        }
        catch (error) {
            console.error("Error deleting song:", error);
        }
        finally {
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
