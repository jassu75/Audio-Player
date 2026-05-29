import Homepage from "../Homepage/homepage";
import Search from "../Search/Search";
import AudioplayerLayout from "../layout/audioplayerLayout/AudioplayerLayout";
import Playlist from "../components/playlist/Playlist";
import FavoritesList from "../ForYou/Favorites/FavoritesList";

const mainRoutes = [
  {
    element: <AudioplayerLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/playlists/:collection/:playlistId?",
        element: <Playlist />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/favorites",
        element: <FavoritesList />,
      },
    ],
  },
];

export default mainRoutes;
