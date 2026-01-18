import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.tsx';

const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-eif2kmcdoddh78w8.us.auth0.com';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'GzSUGTiAfpZQypTvHokzKj8oDH4miNqM';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
