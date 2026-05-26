//Deprecate this
import PreferenceAudioPlayer from "../playSong/PreferenceAudioPlayer";

const audioRoutes = [
  {
    path: "/preference/:preference/song/:songId",
    element: <PreferenceAudioPlayer />,
  },
];

export default audioRoutes;
