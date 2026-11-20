import { useSelector } from "react-redux";
import { currentSongSelector } from "../../redux/selectors/audioPlayerSelectors.js";
import useAudioPlayer from "./hooks/useAudioPlayer";
import useMediaQuery from "@mui/material/useMediaQuery";
import MiniPlayer from "./variations/mini-player/MiniPlayer";
import MaxPlayer from "./variations/max-player/MaxPlayer";
import ExpandedPlayer from "./variations/expanded-player/ExpandedPlayer";

const AudioPlayer = () => {
  const song = useSelector(currentSongSelector);
  const audioPlayerProps = useAudioPlayer();
  const isDesktop = useMediaQuery("(min-width: 901px)");

  if (!song) return null;

  return (
    <>
      <audio ref={audioPlayerProps.audioRef} />
      {isDesktop ? (
        <ExpandedPlayer audioPlayerProps={audioPlayerProps} />
      ) : (
        <>
          <MiniPlayer audioPlayerProps={audioPlayerProps} />
          <MaxPlayer audioPlayerProps={audioPlayerProps} />
        </>
      )}
    </>
  );
};

export default AudioPlayer;
