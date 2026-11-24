import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { removeLegacyUser } from "./services/session";
import { prepareAppUpdate } from "./components/install-app/prepareAppUpdate";
removeLegacyUser();
const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");
const startApp = () => {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  );
  reportWebVitals();
};

if (import.meta.env.PROD) {
  void prepareAppUpdate().then((reloading) => {
    if (!reloading) startApp();
  });
} else {
  startApp();
}
