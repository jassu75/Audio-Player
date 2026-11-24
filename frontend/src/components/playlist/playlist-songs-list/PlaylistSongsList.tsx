import Grid from "@mui/material/Grid";
import { useAppSelector } from "../../../redux/hooks";
import { viewingSongListSelector } from "../../../redux/selectors/audioPlayerSelectors";
import type { PlaylistSongsListProps } from "./types/PlaylistSongsList.types";
import PlaylistSong from "./playlist-song/PlaylistSong";
import styles from "./playlistSongsList.module.css";
const PlaylistSongsList = ({
  playlistId,
  page,
  type,
}: PlaylistSongsListProps) => {
  const viewingSongList = useAppSelector(viewingSongListSelector);
  const start = (page - 1) * 20;
  const end = start + 20;
  return (
    <Grid className={styles.song_list}>
      {Object.values(viewingSongList ?? {})
        .slice(start, end)
        .map((song) => (
          <PlaylistSong
            key={song.song_id}
            playlistId={playlistId}
            song={song}
            type={type}
          />
        ))}
    </Grid>
  );
};
export default PlaylistSongsList;
