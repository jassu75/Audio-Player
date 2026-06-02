import { useSelector } from "react-redux";
import { currentSongSelector } from "../../redux/selectors/audioplayer.selector";
import useAudioPlayer from "./hooks/useAudioplayer";
import useMediaQuery from "@mui/material/useMediaQuery";
import Expandedplayer from "./variations/expandedplayer/Expandedplayer";
import Miniplayer from "./variations/miniPlayer/Miniplayer";

const Audioplayer = () => {
  const song = useSelector(currentSongSelector);
  const audioPlayerProps = useAudioPlayer();
  const isDesktop = useMediaQuery("(min-width: 901px)");

  if (!song) return null;

  return (
    <>
      <audio ref={audioPlayerProps.audioRef} />
      {isDesktop ? (
        <Expandedplayer audioplayerProps={audioPlayerProps} />
      ) : (
        <Miniplayer audioplayerProps={audioPlayerProps} />
      )}
    </>
  );
};

export default Audioplayer;
