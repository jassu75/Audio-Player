import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setViewingSonglist } from "../../../redux/slices/audioplayer.slice";
import { useParams } from "react-router-dom";

const useFetchAudius = () => {
  const playlistTitle = "Audio in Audius";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const { slug } = useParams();
  const slugArray = decodeURIComponent(slug).split("-");
  const playlistId = slugArray.pop();

  useEffect(() => {
    const fetchAudius = async () => {
      try {
        setLoading(true);
        const url = `/api/audius/albumSongs/${playlistId}`;
        const response = await axios.get(url);
        const sourceUrl = response.data.sourceUrl;
        const refinedResponse = response.data?.data?.reduce((acc, song) => {
          acc[song.id] = {
            song_id: song.id,
            title: song.title,
            cover_art: song.artwork["480x480"],
            duration: song.duration,
            release_year: song.release_date?.split("-")[0] || "",
            audio_url: `${sourceUrl}/v1/tracks/${song.id}/stream`,
            album: "",
            artist: "",
            genre: [],
            last_played: null,
            cover_art_id: null,
            audio_url_id: null,
          };
          return acc;
        }, {});
        dispatch(setViewingSonglist(refinedResponse));
      } catch (error) {
        setError(true);
        console.error("Error fetching Audius Album Songs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAudius();
  }, []);

  return { loading, error, playlistTitle };
};

export default useFetchAudius;
