import { useAppDispatch } from "../../../../../redux/hooks";
import { renamePlaylist } from "../../../../../redux/slices/homepageSlice";
import { postApi } from "../../../../../services/api";
import type { RenamePlaylistProps } from "./types/RenamePlaylistTitle.types";
import RenameTitleDialog from "../../shared/RenameTitleDialog";
const RenamePlaylistTitle = ({ open, onClose, playlistId, playlistTitle }: RenamePlaylistProps) => {
    const dispatch = useAppDispatch();
    const handleRename = async (newTitle: string) => {
        const payload = { playlistId, newTitle };
        await postApi("/api/updateplaylisttitle", payload);
        dispatch(renamePlaylist(payload));
    };
    return <RenameTitleDialog open={open} onClose={onClose} itemId={playlistId} currentTitle={playlistTitle} itemType="playlist" onRename={handleRename}/>;
};
export default RenamePlaylistTitle;
