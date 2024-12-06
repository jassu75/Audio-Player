import "./App.css";
import Homepage from "./Homepage/homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AudioPlayer from "./playSong/audioPlayer";
import AudioUploadForm from "./AudioUploadForm/AudioUploadForm";
import UserAuthentication from "./SignUpAndLogin/UserAuthentication";
import DirectToLogin from "./SignUpAndLogin/DirectToLogin";
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
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
