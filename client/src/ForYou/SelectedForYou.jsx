import { useParams } from "react-router-dom";
import JamendoSongList from "./Popular/JamendoSongList";

const SelectedForYou = () => {
  const { foryouTitle } = useParams();

  switch (foryouTitle) {
    case "Popular":
      return <JamendoSongList />;
    default:
      return null;
  }
};

export default SelectedForYou;
