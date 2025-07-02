import "./App.css";
import Homepage from "./Homepage/homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AudioPlayer from "./playSong/audioPlayer";
import UserAuthentication from "./SignUpAndLogin/UserAuthentication";
import DirectToLogin from "./SignUpAndLogin/DirectToLogin";
import SelectedPlaylist from "./Playlist/SelectedPlaylist";
import JamendoAudioPlayer from "./playSong/JamendoAudioPlayer";
import SelectedAlbum from "./Homepage/Sections/Albums/SelectedAlbum";
import AudiusAudioPlayer from "./playSong/audiusAudioPlayer";
import Search from "./Search/Search";
import PlaylistAudioPlayer from "./playSong/playlistAudioPlayer";
import SelectedForYou from "./ForYou/SelectedForYou";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<UserAuthentication />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/user/song/:songId" element={<AudioPlayer />} />
            <Route
              path="/user/playlist/:playlistId/song/:songId"
              element={<PlaylistAudioPlayer />}
            />
            <Route path="/song/:songId" element={<JamendoAudioPlayer />} />
            <Route path="/redirect" element={<DirectToLogin />} />
            <Route
              path="/playlists/:playlistId"
              element={<SelectedPlaylist />}
            />
            <Route path="/album/:slug" element={<SelectedAlbum />} />
            <Route
              path="/album/:playlistId/song/:songId"
              element={<AudiusAudioPlayer />}
            />
            <Route path="/search" element={<Search />} />
            <Route path="/foryou/:foryouTitle" element={<SelectedForYou />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
