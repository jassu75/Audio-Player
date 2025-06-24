import { useDispatch, useSelector } from "react-redux";
import {
  setPlaylistDetails,
  setSongs,
  setUser,
} from "../redux/slices/homepage.slice";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  playlistsSelector,
  songsSelector,
  userSelector,
} from "../redux/selectors/homepage.selector";
import {
  setRecentlyPlayed,
  setFavorite,
} from "../redux/slices/userPreferences.slice";

const useFetchUserDetails = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const songsList = useSelector(songsSelector);
  const playlists = useSelector(playlistsSelector);
  const navigate = useNavigate();

  const [loading, setLoading] = useState({
    user: false,
    songs: false,
    playlists: false,
  });
  const [error, setError] = useState({
    user: false,
    songs: false,
    playlists: false,
  });

  const allSongIds = useMemo(() => {
    const playlistSongIds = Object.values(playlists || {}).flatMap(
      (p) => p.playlist_songs || []
    );
    return user ? [...(user.homepage_songs || []), ...playlistSongIds] : [];
  }, [user, playlists]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/", { replace: true });
      } else if (!user && firebaseUser.uid) {
        try {
          setLoading((prev) => ({ ...prev, user: true }));
          setError((prev) => ({ ...prev, user: false }));

          const response = await axios.post(
            "/api/checkExistingUser",
            { id: firebaseUser.uid },
            { headers: { "Content-Type": "application/json" } }
          );

          dispatch(setUser(response.data?.users));
          dispatch(
            setRecentlyPlayed(response.data?.user_preferences.recently_played)
          );
          dispatch(setFavorite(response.data?.user_preferences.favorites));
        } catch (error) {
          setError((prev) => ({ ...prev, user: true }));
          console.error("Error fetching user details:", error);
        } finally {
          setLoading((prev) => ({ ...prev, user: false }));
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, user, navigate]);

  useEffect(() => {
    const fetchSongs = async (song_ids) => {
      try {
        setLoading((prev) => ({ ...prev, songs: true }));
        setError((prev) => ({ ...prev, songs: false }));

        const response = await axios.post(
          "/api/getSongs",
          { song_ids },
          { headers: { "Content-Type": "application/json" } }
        );

        const songsHashMap = response.data.audio_details.reduce((acc, song) => {
          const { id, ...rest } = song;
          acc[id] = rest;
          return acc;
        }, {});
        dispatch(setSongs(songsHashMap));
      } catch (error) {
        setError((prev) => ({ ...prev, songs: true }));
        console.error("Error fetching songs", error);
      } finally {
        setLoading((prev) => ({ ...prev, songs: false }));
      }
    };

    if (user && playlists && !songsList) {
      fetchSongs(allSongIds);
    }
  }, [user, playlists, songsList, allSongIds, dispatch]);

  useEffect(() => {
    const fetchPlaylists = async (playlist_ids) => {
      try {
        setLoading((prev) => ({ ...prev, playlists: true }));
        setError((prev) => ({ ...prev, playlists: false }));

        const response = await axios.post(
          "/api/getPlaylists",
          { playlist_ids },
          { headers: { "Content-Type": "application/json" } }
        );

        const playlistHashMap = response.data.playlist_details.reduce(
          (acc, playlist) => {
            const { id, ...rest } = playlist;
            acc[id] = rest;
            return acc;
          },
          {}
        );
        dispatch(setPlaylistDetails(playlistHashMap));
      } catch (error) {
        setError((prev) => ({ ...prev, playlists: true }));
        console.error("Error fetching playlists", error);
      } finally {
        setLoading((prev) => ({ ...prev, playlists: false }));
      }
    };

    if (user && !playlists) {
      fetchPlaylists(user.playlist_ids);
    }
  }, [user, dispatch]);

  return {
    userLoading: loading.user || loading.songs || loading.playlists,
    userError: error.user || error.songs || error.playlists,
  };
};

export default useFetchUserDetails;
