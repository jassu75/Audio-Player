import { useQuery } from "@apollo/client";
import { GET_PLAYLISTS } from "../queries";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylistDetails } from "../Songlist/HomepageSongs/homepage.slice";
import { useEffect } from "react";

const useHomepagePlaylists = () => {
    const { data, loading, error } = useQuery(GET_PLAYLISTS);
    const dispatch = useDispatch();
    const playlistSongs = useSelector((state) => state.homepage.playlists);

    useEffect(() => {
        if (data?.playlist_details && Object.keys(playlistSongs).length === 0) {
            const playlistHashMap = data.playlist_details.reduce((acc, song) => {
                const { id, ...rest } = song;
                acc[id] = rest;
                return acc;
            }, {});

            dispatch(setPlaylistDetails(playlistHashMap));

            localStorage.setItem("playlists", JSON.stringify(playlistHashMap));
        }
    }, [data]);

    return { loading, error };
};

export default useHomepagePlaylists;
