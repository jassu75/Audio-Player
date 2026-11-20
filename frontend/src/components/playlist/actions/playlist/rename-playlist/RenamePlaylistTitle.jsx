import { useDispatch } from "react-redux";
import axios from "axios";
import { renamePlaylist } from "../../../../../redux/slices/homepageSlice";
import RenameTitleDialog from "../../shared/RenameTitleDialog";

const RenamePlaylistTitle = ({ open, onClose, playlistId, playlistTitle }) => {
  const dispatch = useDispatch();
  const handleRename = async (newTitle) => {
    const payload = { playlistId, newTitle };
    await axios.post("/api/updateplaylisttitle", payload);
    dispatch(renamePlaylist(payload));
  };
  return <RenameTitleDialog open={open} onClose={onClose} itemId={playlistId}
    currentTitle={playlistTitle} itemType="playlist" onRename={handleRename} />;
};

export default RenamePlaylistTitle;
