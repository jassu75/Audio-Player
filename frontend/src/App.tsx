import InstallApp from "./components/install-app/InstallApp";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, useRoutes } from "react-router-dom";
import "./App.css";
import theme from "./theme/theme";
import authRoutes from "./routes/authRoutes";
import mainRoutes from "./routes/mainRoutes";
const AppRoutes = () => {
  const routes = useRoutes([...mainRoutes, ...authRoutes]);
  return routes;
};
function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="App">
          <AppRoutes />
          <InstallApp />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;
