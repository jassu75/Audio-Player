import "./App.css";
import Homepage from "./Homepage/homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AudioPlayer from "./playSong/audioPlayer";
import UserAuthentication from "./SignUpAndLogin/UserAuthentication";
import DirectToLogin from "./SignUpAndLogin/DirectToLogin";
import SelectedPlaylist from "./playSong/SelectedPlaylist";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<UserAuthentication />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/songs/:id" element={<AudioPlayer />} />
            <Route path="/redirect" element={<DirectToLogin />} />
            <Route path="/playlists/:id" element={<SelectedPlaylist />} />


          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
