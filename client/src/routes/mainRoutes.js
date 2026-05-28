import Homepage from "../Homepage/homepage";
import SelectedPlaylist from "../playlist/SelectedPlaylist";
import SelectedAlbum from "../Homepage/Sections/Albums/SelectedAlbum";
import Search from "../Search/Search";
import SelectedForYou from "../ForYou/SelectedForYou";
import AudioplayerLayout from "../layout/audioplayerLayout/AudioplayerLayout";

const mainRoutes = [
  {
    element: <AudioplayerLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/playlists/:playlistId",
        element: <SelectedPlaylist />,
      },
      {
        path: "/album/:slug",
        element: <SelectedAlbum />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/foryou/:foryouTitle",
        element: <SelectedForYou />,
      },
    ],
  },
];

export default mainRoutes;
