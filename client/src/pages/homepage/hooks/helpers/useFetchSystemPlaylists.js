import { useEffect, useState } from "react";

import axiosAuth from "../../../../config/axiosAuth";

const useFetchSystemPlaylists = (enabled = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    const fetchSystemPlaylists = async () => {
      try {
        setLoading(true);
        const response = await axiosAuth.get("/api/fetch-system-playlists");
        const refinedResponse = response.data.playlist_details.map(
          (playlist) => ({
            playlist_id: playlist.playlist_id,
            playlist_title: playlist.playlist_title,
            playlist_cover_art: playlist.playlist_cover_art,
          }),
        );
        setCollection(refinedResponse);
        setCollection(refinedResponse);
      } catch (error) {
        setError(true);
        console.error("Error fetching System Playlists", error);
      } finally {
        setLoading(false);
      }
    };
    if (!enabled) return;
    fetchSystemPlaylists();
  }, [enabled]);

  return { loading, error, collection };
};

export default useFetchSystemPlaylists;
