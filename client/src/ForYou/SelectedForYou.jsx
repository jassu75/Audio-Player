import { useParams } from "react-router-dom";
import JamendoSongList from "./Popular/JamendoSongList";
import RecentsList from "./Recents/RecentsList";

const SelectedForYou = () => {
  const { foryouTitle } = useParams();

  switch (foryouTitle) {
    case "Popular":
      return <JamendoSongList />;
    case "Recents":
      return <RecentsList />;
    default:
      return null;
  }
};

export default SelectedForYou;
