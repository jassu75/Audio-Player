import { useParams } from "react-router-dom";
import JamendoSongList from "./Popular/JamendoSongList";
import RecentsList from "./Recents/RecentsList";
import FavoritesList from "./Favorites/FavoritesList";

const SelectedForYou = () => {
  const { foryouTitle } = useParams();

  switch (foryouTitle) {
    case "Popular":
      return <JamendoSongList />;
    case "Recents":
      return <RecentsList />;
    case "Favorites":
      return <FavoritesList />;
    default:
      return null;
  }
};

export default SelectedForYou;
