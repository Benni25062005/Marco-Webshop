import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./src/App.jsx";
import store, { persistor } from "./src/app/store.js"; // persistor mitimportieren
import { PersistGate } from "redux-persist/integration/react";
import { fetchFeuerloescher } from "./src/features/products/productsSlice.js";

store.dispatch(fetchFeuerloescher());

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
