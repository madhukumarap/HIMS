import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import CurrencyProvider from "./context/CurrencyProvider";
import HospitalProvider from "./context/HospitalDataProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HospitalProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </HospitalProvider>
  </React.StrictMode>
);
