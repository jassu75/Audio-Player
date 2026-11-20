import { useAppDispatch } from "../../../../../redux/hooks";
import { renameViewingSong } from "../../../../../redux/slices/audioPlayerSlice";
import { postApi } from "../../../../../services/api";
import type { RenameSongProps } from "./types/RenameSongTitle.types";
import RenameTitleDialog from "../../shared/RenameTitleDialog";
const RenameSongTitle = ({ open, onClose, songId, songTitle }: RenameSongProps) => {
    const dispatch = useAppDispatch();
    const handleRename = async (newTitle: string) => {
        const payload = { songId, newTitle };
        await postApi("/api/updatesongtitle", payload);
        dispatch(renameViewingSong(payload));
    };
    return <RenameTitleDialog open={open} onClose={onClose} itemId={songId} currentTitle={songTitle} itemType="song" onRename={handleRename}/>;
};
export default RenameSongTitle;
