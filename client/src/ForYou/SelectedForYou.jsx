import { useParams } from "react-router-dom";
import JamendoSongList from "./Popular/JamendoSongList";
import RecentsList from "./Recents/RecentsList";
import FavoritesList from "./Favorites/FavoritesList";
import MostPlayedList from "./MostPlayed/MostPlayedList";

const SelectedForYou = () => {
  const { foryouTitle } = useParams();
  switch (foryouTitle) {
    case "Popular":
      return <JamendoSongList />;
    case "Recents":
      return <RecentsList />;
    case "Favorites":
      return <FavoritesList />;
    case "Most Played":
      return <MostPlayedList />;
    default:
      return null;
  }
};

export default SelectedForYou;
