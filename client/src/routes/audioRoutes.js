//Deprecate this
import AudioPlayer from "../playSong/audioPlayer";
import JamendoAudioPlayer from "../playSong/JamendoAudioPlayer";
import PlaylistAudioPlayer from "../playSong/playlistAudioPlayer";
import PreferenceAudioPlayer from "../playSong/PreferenceAudioPlayer";

const audioRoutes = [
  {
    path: "/user/song/:songId",
    element: <AudioPlayer />,
  },
  {
    path: "/user/playlist/:playlistId/song/:songId",
    element: <PlaylistAudioPlayer />,
  },
  {
    path: "/song/:songId",
    element: <JamendoAudioPlayer />,
  },

  {
    path: "/preference/:preference/song/:songId",
    element: <PreferenceAudioPlayer />,
  },
];

export default audioRoutes;
