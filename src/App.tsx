import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Router } from "./routes/router";
import "./App.css";
import { setAuth0Client } from "./services/api";

const App: React.FC = () => {
  const auth0Client = useAuth0();
  const { isLoading, isAuthenticated } = auth0Client;

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setAuth0Client(auth0Client);
    }
  }, [isLoading, isAuthenticated, auth0Client]);

  return <Router />;
};

export default App;
