import { useSelector } from "react-redux";
import { currentSongSelector } from "../../redux/selectors/audioplayer.selector";
import useAudioPlayer from "./hooks/useAudioplayer";
import useMediaQuery from "@mui/material/useMediaQuery";
import Miniplayer from "./variations/miniPlayer/Miniplayer";
import { useState } from "react";
import Maxplayer from "./variations/maxplayer/Maxplayer";
import Expandedplayer from "./variations/expandedplayer/Expandedplayer";

const Audioplayer = () => {
  const song = useSelector(currentSongSelector);
  const audioPlayerProps = useAudioPlayer();
  const isDesktop = useMediaQuery("(min-width: 901px)");

  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(true);
  };
  const handleCollapse = () => {
    setIsExpanded(false);
  };

  if (!song) return null;

  return (
    <>
      <audio ref={audioPlayerProps.audioRef} />
      {isDesktop ? (
        <Expandedplayer audioplayerProps={audioPlayerProps} />
      ) : (
        <>
          <Miniplayer
            audioplayerProps={audioPlayerProps}
            handleExpand={handleExpand}
          />
          <Maxplayer
            audioplayerProps={audioPlayerProps}
            open={isExpanded}
            handleCollapse={handleCollapse}
          />
        </>
      )}
    </>
  );
};

export default Audioplayer;
