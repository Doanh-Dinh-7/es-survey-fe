import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    } else {
      loginWithRedirect({
        appState: {
          returnTo: window.location.origin,
        }
      });
    }
  }, [isAuthenticated, loginWithRedirect, navigate]);

  return null; // Không render gì cả, chỉ chuyển hướng
};

export default Login;

