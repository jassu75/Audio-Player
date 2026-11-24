import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { removeLegacyUser } from "./services/session";
import { prepareAppUpdate } from "./components/install-app/prepareAppUpdate";
import AppUpdateGate from "./components/install-app/AppUpdateGate";
removeLegacyUser();
const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");
const startup = import.meta.env.PROD
  ? prepareAppUpdate()
  : Promise.resolve({ status: "ready" } as const);
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <AppUpdateGate startup={startup}>
      <Provider store={store}>
        <App />
      </Provider>
    </AppUpdateGate>
  </React.StrictMode>,
);
reportWebVitals();
