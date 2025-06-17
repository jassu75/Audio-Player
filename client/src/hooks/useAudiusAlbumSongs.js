import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAudiusSongs } from "../redux/slices/homepage.slice";

const useAudiusAlbumSong = (playlistId) => {
  const [audiusAlbumSongLoading, setAudiusAlbumSongLoading] = useState(false);
  const [audiusAlbumSongError, setAudiusAlbumSongError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAudiusAlbumSongs = async () => {
      try {
        setAudiusAlbumSongLoading(true);
        const url = `/api/audius/albumSongs/${playlistId}`;
        const response = await axios.get(url);
        const sourceUrl = response.data.sourceUrl;
        const refinedAlbums = response.data?.data?.map((song) => ({
          id: song.id,
          title: song.title,
          cover_art: song.artwork["480x480"],
          duration: song.duration,
          release_year: song.release_date?.split("-")[0],
          audio_url: `${sourceUrl}/v1/tracks/${song.id}/stream`,
        }));
        dispatch(setAudiusSongs(refinedAlbums));
      } catch (error) {
        setAudiusAlbumSongError(true);
        console.error("Error fetching Audius Album Songs", error);
      } finally {
        setAudiusAlbumSongLoading(false);
      }
    };
    fetchAudiusAlbumSongs();
  }, []);

  return { audiusAlbumSongLoading, audiusAlbumSongError };
};

export default useAudiusAlbumSong;
