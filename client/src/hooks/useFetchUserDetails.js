import { useDispatch, useSelector } from "react-redux";
import { setPlaylistDetails, setUser } from "../redux/slices/homepage.slice";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  playlistsSelector,
  userSelector,
} from "../redux/selectors/homepage.selector";

const useFetchUserDetails = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const playlists = useSelector(playlistsSelector);
  const navigate = useNavigate();

  const [firebaseUser, setFirebaseUser] = useState(null);

  const [loading, setLoading] = useState({
    user: false,
    playlists: false,
  });
  const [error, setError] = useState({
    user: false,
    playlists: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setFirebaseUser(authUser);
      } else {
        navigate("/", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading((prev) => ({ ...prev, user: true }));
        setError((prev) => ({ ...prev, user: false }));

        const response = await axios.post(
          "/api/checkExistingUser",
          { user_id: firebaseUser.uid },
          { headers: { "Content-Type": "application/json" } }
        );
        dispatch(setUser(response.data?.users));
      } catch (error) {
        setError((prev) => ({ ...prev, user: true }));
        console.error("Error fetching user details:", error);
      } finally {
        setLoading((prev) => ({ ...prev, user: false }));
      }
    };
    if (!user && firebaseUser) {
      fetchUser();
    }
  }, [dispatch, firebaseUser, user]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading((prev) => ({ ...prev, playlists: true }));
        setError((prev) => ({ ...prev, playlists: false }));

        const response = await axios.post(
          "/api/getPlaylists",
          { user_id: firebaseUser.uid },
          { headers: { "Content-Type": "application/json" } }
        );

        const playlistHashMap = response.data.playlist_details.reduce(
          (acc, playlist) => {
            const { playlist_id, ...rest } = playlist;
            acc[playlist_id] = rest;
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
    if (!playlists && firebaseUser) {
      fetchPlaylist();
    }
  }, [dispatch, firebaseUser, playlists]);

  return {
    userLoading: loading.user || loading.playlists,
    userError: error.user || error.playlists,
  };
};

export default useFetchUserDetails;
