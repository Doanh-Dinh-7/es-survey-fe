import React from "react";
import { AppState, Auth0Provider, CacheLocation } from "@auth0/auth0-react";

interface Auth0ProviderWithNavigateProps {
  children: React.ReactNode;
  onRedirectCallback?: (appState?: AppState) => void;
}

const Auth0ProviderWithNavigate = ({
  children,
  onRedirectCallback,
}: Auth0ProviderWithNavigateProps) => {

  const domain = import.meta.env.VITE_AUTH0_DOMAIN || "";
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "";
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE || "";
  const redirectUri = import.meta.env.VITE_WEB_DOMAIN + '/auth/callback' || "";
  const orgId = import.meta.env.VITE_AUTH0_ORG_ID || "";

  const providerConfig = {
    domain,
    clientId,
    // onRedirectCallback  : (appState: any) => {
    //   // This function is called after the user has logged in or logged out
    //   // You can redirect the user to a specific page after login/logout
    //   const targetUrl = appState?.targetUrl || window.location.pathname;
    //   window.history.replaceState({}, document.title, targetUrl);
    // },
    onRedirectCallback,
    authorizationParams: {
      redirect_uri: redirectUri,
      scope: "openid profile email offline_access",
      organization: orgId,
      audience: audience,
    },
    // --- Cấu hình để duy trì phiên ---
    useRefreshTokens: true, // Bật tính năng Refresh Token Rotation
    cacheLocation: "localstorage" as CacheLocation, 
    // --- End Cấu hình ---
  };

  return (
    <Auth0Provider {...providerConfig}>
        {children}
    </Auth0Provider>);
};
export default Auth0ProviderWithNavigate;
