import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import client from "./apolloClient";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Import polyfills
import "./polyfills";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
