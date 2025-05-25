import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import store from "./store";
import client from "./apolloClient";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "./polyfills";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
