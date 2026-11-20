import RequireAudioPlayer from "../protected/components/audio-player/RequireAudioPlayer";
import RequireStates from "../protected/states/RequireStates";
import FavoriteSkeleton from "../components/skeletons/favorites/FavoriteSkeleton";
import HomepageSkeleton from "../components/skeletons/homepage/HomepageSkeleton";
import PlaylistSkeleton from "../components/skeletons/playlist/PlaylistSkeleton";
import SearchSkeleton from "../components/skeletons/search/SearchSkeleton";
import Favorites from "../pages/favorites/Favorites";
import Home from "../pages/homepage/Home";
import Playlist from "../pages/playlist/Playlist";
import Search from "../pages/search/Search";
const mainRoutes = [
    {
        element: <RequireAudioPlayer />,
        children: [
            {
                path: "/",
                element: (<RequireStates requires={["user", "playlistCollection"]} skeleton={<HomepageSkeleton />}>
            <Home />
          </RequireStates>),
            },
            {
                path: "/playlists/:playlistId?",
                element: (<RequireStates requires={["user", "playlistCollection", "favorites"]} skeleton={<PlaylistSkeleton />}>
            <Playlist />
          </RequireStates>),
            },
            {
                path: "/search",
                element: (<RequireStates requires={["user"]} skeleton={<SearchSkeleton />}>
            <Search />
          </RequireStates>),
            },
            {
                path: "/favorites",
                element: (<RequireStates requires={["user"]} skeleton={<FavoriteSkeleton />}>
            <Favorites />
          </RequireStates>),
            },
        ],
    },
];
export default mainRoutes;
