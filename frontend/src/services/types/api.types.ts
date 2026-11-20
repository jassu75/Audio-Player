import type { UserProfile } from "../../hooks/types/useFetchUser.types";
import type { Playlist } from "../../components/playlist-rail/types/playlist.types";
import type { Song } from "../../components/playlist/playlist-songs-list/playlist-song/types/song.types";
import type { Asset } from "../../hooks/cloudinary/types/useCloudinaryUpload.types";
export interface ApiEndpoints {
    "/api/auth/session": Endpoint<{ idToken: string }, { users: UserProfile }>;
    "/api/auth/logout": Endpoint<Record<string, never>>;
    "/api/checkExistingUser": Endpoint<UserRequest, {
        users: UserProfile | null;
    }>;
    "/api/verifyemail": Endpoint<{
        email_id: string | null;
    }, {
        users: {
            email_id: string;
        }[];
    }>;
    "/api/addUser": Endpoint<{
        newUser: UserRequest & {
            email_id: string | null;
            username: string;
            sign_in_method: string;
        };
    }>;
    "/api/getPlaylists": Endpoint<UserRequest, {
        playlist_details: Playlist[];
    }>;
    "/api/fetchPlaylistSongs": Endpoint<{
        playlist_id: string;
    }, {
        playlists: {
            songs: Song | null;
        }[];
    }>;
    "/api/fetchfavorites": Endpoint<UserRequest, {
        favorites: {
            song: Song | null;
        }[];
    }>;
    "/api/fetchfavoriteids": Endpoint<UserRequest, {
        favoriteIds: {
            favorite_id: string;
        }[];
    }>;
    "/api/fetchsearchsongs": Endpoint<UserRequest & {
        search_text: string;
    }, {
        searchResults: Song[];
    }>;
    "/api/fetchrecentlyplayed": Endpoint<UserRequest, {
        recently_played: Song[];
    }>;
    "/api/fetchMostListened": Endpoint<UserRequest, {
        most_listened: Song[];
    }>;
    "/api/addfavorite": Endpoint<FavoriteRequest>;
    "/api/deletefavorite": Endpoint<FavoriteRequest>;
    "/api/updatesongtitle": Endpoint<{
        songId: string;
        newTitle: string;
    }>;
    "/api/updateplaylisttitle": Endpoint<{
        playlistId: string;
        newTitle: string;
    }>;
    "/api/deletePlaylist": Endpoint<{
        playlist_id: string;
    }>;
    "/api/deletesong": Endpoint<{
        song_id: string;
        playlist_id: string;
        assets: Asset[];
    }>;
    "/api/moveSong": Endpoint<{
        oldPlaylistId: string;
        newPlaylistId: string;
        songId: string;
    }>;
    "/api/addPlaylist": Endpoint<{
        uploadPlaylist: Omit<Playlist, "playlist_id"> & UserRequest;
    }, {
        playlist_details: {
            returning: Playlist[];
        };
    }>;
    "/api/addSong": Endpoint<{
        uploadedSong: Omit<Song, "song_id">;
    }, {
        audio_details: {
            returning: Pick<Song, "song_id" | "title" | "artist">[];
        };
    }>;
    "/api/addPlaylistSong": Endpoint<{
        song_id: string;
        playlist_id: string;
    }>;
    "/api/fetchassets": Endpoint<UserRequest, {
        assets: Pick<Song, "cover_art_id" | "audio_url_id">[];
    }>;
    "/api/deleteuser": Endpoint<{
        assets: Asset[];
    }>;
    "/api/updateUserPreference": Endpoint<{
        data: ListeningUpdate[];
    }>;
}
type Endpoint<Request, Response = unknown> = {
    request: Request;
    response: Response;
};
type UserRequest = {
    user_id: string;
};
type FavoriteRequest = UserRequest & {
    favorite_id: string;
};
export interface ListeningUpdate {
    where: {
        song_id: {
            _eq: string;
        };
        _or: [
            {
                last_played: {
                    _is_null: boolean;
                };
            },
            {
                last_played: {
                    _neq: string;
                };
            }
        ];
    };
    _set: {
        last_played: string;
    };
    _inc: {
        listens: number;
    };
}
