import './App.css';
import Homepage from './homepage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Homepage />
      </div>
    </ThemeProvider>
  );
}

export default App;
