import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import 'primeicons/primeicons.css';
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Auth0Provider } from "@auth0/auth0-react";
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Provider } from "react-redux";
import store from "./store/store";


const root = ReactDOM.createRoot(document.getElementById("root"));
const domain = process.env.REACT_APP_DOMAIN_ID;
const clientID = process.env.REACT_APP_CLIENT_ID;
const apiAudience = process.env.REACT_APP_AUDIENCE;
root.render(
  // <React.StrictMode>
  <Auth0Provider
    domain={domain}
    clientId={clientID}
    authorizationParams={{
      useRefreshTokens: true,
      redirect_uri: window.location.origin,
      ignoreCache: true,
      audience: apiAudience,
      prompt: "login"
    }}
  >
    <PrimeReactProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </PrimeReactProvider>
  </Auth0Provider>
  // </React.StrictMode>
);
