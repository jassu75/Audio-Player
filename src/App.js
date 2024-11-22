import "./App.css";
import Homepage from "./homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AudioPlayer from "./playSong/audioPlayer";
import AudioUploadForm from "./AudioUploadForm/AudioUploadForm";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/songs/:id" element={<AudioPlayer />} />
            <Route path="/audio" element={<AudioUploadForm />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
