import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";

interface TimingStartFormProps {
  onStartSession: (email: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const TimingStartForm: React.FC<TimingStartFormProps> = ({
  onStartSession,
  isLoading = false,
  error = null,
}) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Email is not valid");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      await onStartSession(email);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      p={6}
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={2}>
            Start survey
          </Text>
          <Text fontSize="sm" color="gray.600">
            Please enter your email to start the survey with time limit
          </Text>
        </Box>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!emailError}>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                Email
              </FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) {
                    validateEmail(e.target.value);
                  }
                }}
                onBlur={() => validateEmail(email)}
                isDisabled={isLoading}
                size="lg"
                borderRadius="md"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
              />
              <FormErrorMessage>{emailError}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Starting..."
              isDisabled={!email.trim() || !!emailError}
              borderRadius="md"
              fontWeight="medium"
            >
              Start survey
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default TimingStartForm;
