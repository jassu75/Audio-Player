import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppSelector } from "../../redux/hooks";
import { currentSongSelector } from "../../redux/selectors/audioPlayerSelectors";
import useAudioPlayer from "./hooks/useAudioPlayer";
import ExpandedPlayer from "./variations/expanded-player/ExpandedPlayer";
import MaxPlayer from "./variations/max-player/MaxPlayer";
import MiniPlayer from "./variations/mini-player/MiniPlayer";
const AudioPlayer = () => {
  const song = useAppSelector(currentSongSelector);
  const audioPlayerProps = useAudioPlayer();
  const isDesktop = useMediaQuery("(min-width: 901px)");
  return (
    <>
      <audio ref={audioPlayerProps.audioRef} autoPlay preload="auto" />
      {!song ? null : isDesktop ? (
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
