// src/App.js

import "./App.css";
import { useRoutes, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import audioRoutes from "./routes/audioRoutes";
import mainRoutes from "./routes/mainRoutes";
import authRoutes from "./routes/authRoutes";

const AppRoutes = () => {
  const routes = useRoutes([...mainRoutes, ...authRoutes, ...audioRoutes]);

  return routes;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="App">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
