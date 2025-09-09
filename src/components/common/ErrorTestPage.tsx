import React, { useState } from "react";
import { Box, VStack, Button, Text, useColorModeValue } from "@chakra-ui/react";
import OrganizationErrorModal from "./OrganizationErrorModal";
import GeneralErrorModal from "./GeneralErrorModal";
import {
  getErrorType,
  getErrorMessage,
  getErrorTitle,
  Auth0Error,
} from "../../utils/authErrorUtils";

// Chỉ sử dụng trong development
const ErrorTestPage: React.FC = () => {
  const [currentError, setCurrentError] = useState<Auth0Error | null>(null);
  const [showError, setShowError] = useState(false);

  const testErrors: { name: string; error: Auth0Error }[] = [
    {
      name: "Organization Error",
      error: {
        message: "User is not part of the organization",
        error: "unauthorized_organization",
      },
    },
    {
      name: "Network Error",
      error: {
        message: "Network error occurred",
        error: "network_error",
      },
    },
    {
      name: "Authentication Error",
      error: {
        message: "Invalid token",
        error: "invalid_token",
      },
    },
    {
      name: "Authorization Error",
      error: {
        message: "Access denied",
        error: "forbidden",
      },
    },
    {
      name: "General Error",
      error: {
        message: "Something went wrong",
        error: "unknown_error",
      },
    },
  ];

  const handleTestError = (error: Auth0Error) => {
    setCurrentError(error);
    setShowError(true);
  };

  const handleClose = () => {
    setShowError(false);
    setCurrentError(null);
  };

  if (showError && currentError) {
    const errorType = getErrorType(currentError);
    const errorMessage = getErrorMessage(currentError, errorType);
    const errorTitle = getErrorTitle(errorType);

    if (errorType === "organization") {
      return (
        <OrganizationErrorModal
          onGoHome={handleClose}
          onTryAgain={handleClose}
          errorMessage={errorMessage}
        />
      );
    }

    return (
      <GeneralErrorModal
        onGoHome={handleClose}
        onTryAgain={handleClose}
        errorMessage={errorMessage}
        title={errorTitle}
      />
    );
  }

  return (
    <Box
      p={8}
      maxW="container.md"
      mx="auto"
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack spacing={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Test Error Pages
        </Text>
        <Text color="gray.600" textAlign="center">
          Click on any button below to test different error scenarios
        </Text>

        <VStack spacing={4} w="full">
          {testErrors.map((testError, index) => (
            <Button
              key={index}
              w="full"
              colorScheme="blue"
              onClick={() => handleTestError(testError.error)}
            >
              {testError.name}
            </Button>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default ErrorTestPage;
