export interface Auth0Error {
  message?: string;
  error?: string;
  error_description?: string;
  [key: string]: any;
}

export const getErrorType = (
  error: Auth0Error | null
):
  | "organization"
  | "network"
  | "authentication"
  | "authorization"
  | "general" => {
  if (!error) return "general";

  const message = error.message?.toLowerCase() || "";
  const errorCode = error.error?.toLowerCase() || "";
  const description = error.error_description?.toLowerCase() || "";

  // Kiểm tra lỗi organization
  if (
    message.includes("organization") ||
    message.includes("org") ||
    message.includes("tổ chức") ||
    errorCode === "unauthorized_organization" ||
    description.includes("organization") ||
    description.includes("org")
  ) {
    return "organization";
  }

  // Kiểm tra lỗi network
  if (
    message.includes("network") ||
    message.includes("connection") ||
    message.includes("timeout") ||
    message.includes("fetch") ||
    errorCode === "network_error"
  ) {
    return "network";
  }

  // Kiểm tra lỗi authentication
  if (
    message.includes("invalid") ||
    message.includes("expired") ||
    message.includes("token") ||
    errorCode === "invalid_token" ||
    errorCode === "expired_token"
  ) {
    return "authentication";
  }

  // Kiểm tra lỗi authorization
  if (
    message.includes("unauthorized") ||
    message.includes("forbidden") ||
    message.includes("access denied") ||
    errorCode === "unauthorized" ||
    errorCode === "forbidden"
  ) {
    return "authorization";
  }

  return "general";
};

export const getErrorMessage = (
  error: Auth0Error | null,
  errorType: string
): string => {
  if (!error) return "An unknown error occurred.";

  switch (errorType) {
    case "organization":
      return "Your account is not part of an organization authorized to access this system. Please contact your administrator to obtain access.";

    case "network":
      return "Unable to connect to server. Please check your internet connection and try again.";

    case "authentication":
      return "Your session has expired or is invalid. Please log in again.";

    case "authorization":
      return "You do not have access to this resource.";

    default:
      return (
        error.message ||
        error.error_description ||
        "An error occurred during authentication."
      );
  }
};

export const getErrorTitle = (errorType: string): string => {
  switch (errorType) {
    case "organization":
      return "Unable to access";

    case "network":
      return "Connection error";

    case "authentication":
      return "Authentication Error";

    case "authorization":
      return "No access";

    default:
      return "Authentication Error";
  }
};
