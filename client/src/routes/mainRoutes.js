import Homepage from "../pages/homepage/homepage";
import Search from "../pages/search/Search";
import AudioplayerLayout from "../layout/audioplayerLayout/AudioplayerLayout";
import Playlist from "../pages/playlist/Playlist";
import Favorites from "../pages/favorites/Favorites";

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
        element: <Favorites />,
      },
    ],
  },
];

export default mainRoutes;
