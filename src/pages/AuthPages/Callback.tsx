import React, { useEffect } from "react";
import { AppState, useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../LoadingPage";
import OrganizationErrorModal from "../../components/common/OrganizationErrorModal";
import GeneralErrorModal from "../../components/common/GeneralErrorModal";
import {
  getErrorType,
  getErrorMessage,
  getErrorTitle,
  Auth0Error,
} from "../../utils/authErrorUtils";

const Callback: React.FC = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Callback useEffect fired");
    if (!isLoading && !error) {
      try {
        const appState = window.history.state?.usr?.appState as
          | AppState
          | undefined;
        const returnTo =
          appState?.returnTo || localStorage.getItem("returnUrl") || "/";

        localStorage.removeItem("returnUrl");

        setTimeout(() => {
          navigate(returnTo, { replace: true });
        }, 600); // delay để animation kết thúc nếu cần
      } catch (e: any) {
        console.error("Error handling redirect callback:", e);
        console.error("Error message:", e.message);
        console.error("Error stack:", e.stack);
        // navigate("/error");
      }
    }
  }, [isLoading, error, navigate, isAuthenticated]);

  // Phân loại lỗi
  const errorType = getErrorType(error as Auth0Error);
  const errorMessage = getErrorMessage(error as Auth0Error, errorType);
  const errorTitle = getErrorTitle(errorType);

  if (error) {
    // Nếu là lỗi organization, hiển thị giao diện chuyên dụng
    if (errorType === "organization") {
      return (
        <OrganizationErrorModal
          onGoHome={() => navigate("/")}
          onTryAgain={() => window.location.reload()}
          errorMessage={errorMessage}
        />
      );
    }

    // Các lỗi khác
    return (
      <GeneralErrorModal
        onGoHome={() => navigate("/")}
        onTryAgain={() => window.location.reload()}
        errorMessage={errorMessage}
        title={errorTitle}
      />
    );
  }

  if (isLoading) {
    return <LoadingPage />;
  }
};

export default Callback;
