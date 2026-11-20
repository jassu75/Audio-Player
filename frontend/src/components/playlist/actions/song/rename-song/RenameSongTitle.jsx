import { useDispatch } from "react-redux";
import axios from "axios";
import { renameViewingSong } from "../../../../../redux/slices/audioPlayerSlice";
import RenameTitleDialog from "../../shared/RenameTitleDialog";

const RenameSongTitle = ({ open, onClose, songId, songTitle }) => {
  const dispatch = useDispatch();
  const handleRename = async (newTitle) => {
    const payload = { songId, newTitle };
    await axios.post("/api/updatesongtitle", payload);
    dispatch(renameViewingSong(payload));
  };
  return <RenameTitleDialog open={open} onClose={onClose} itemId={songId}
    currentTitle={songTitle} itemType="song" onRename={handleRename} />;
};

export default RenameSongTitle;
