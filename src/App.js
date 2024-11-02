import './App.css';
import Homepage from './homepage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import PlaySong from './playSong';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/songs/:id" element={<PlaySong />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
