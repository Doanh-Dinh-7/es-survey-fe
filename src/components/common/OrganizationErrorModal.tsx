import React from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiUsers, FiAlertTriangle } from "react-icons/fi";

const MotionBox = motion(Box);
const MotionText = motion(Text);

interface OrganizationErrorModalProps {
  onGoHome: () => void;
  onTryAgain?: () => void;
  errorMessage?: string;
}

const OrganizationErrorModal: React.FC<OrganizationErrorModalProps> = ({
  onGoHome,
  onTryAgain,
  errorMessage = "Your account does not belong to an organization authorized to access this system.",
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const iconColor = useColorModeValue("red.500", "red.400");

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      p={4}
    >
      <MotionBox
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="xl"
        p={8}
        maxW="md"
        w="full"
        textAlign="center"
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack spacing={6}>
          {/* Icon Container */}
          <MotionBox
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            position="relative"
          >
            <Box
              bg={useColorModeValue("red.50", "red.900")}
              borderRadius="full"
              p={4}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiUsers} boxSize={8} color={iconColor} />
            </Box>
            <Box
              position="absolute"
              top="-2"
              right="-2"
              bg="red.500"
              borderRadius="full"
              p={1}
            >
              <Icon as={FiAlertTriangle} boxSize={3} color="white" />
            </Box>
          </MotionBox>

          {/* Title */}
          <MotionText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            fontSize="2xl"
            fontWeight="bold"
            color={useColorModeValue("gray.800", "white")}
          >
            Unable to access
          </MotionText>

          {/* Error Message */}
          <MotionText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            color={textColor}
            fontSize="md"
            lineHeight="tall"
            px={2}
          >
            {errorMessage}
          </MotionText>

          {/* Action Buttons */}
          <VStack spacing={3} w="full" pt={2}>
            <Button
              leftIcon={<FiUsers />}
              colorScheme="blue"
              size="lg"
              w="full"
              onClick={onGoHome}
              _hover={{ transform: "translateY(-1px)" }}
              transition="all 0.2s"
            >
              Back to Login
            </Button>

            {onTryAgain && (
              <Button
                variant="outline"
                size="lg"
                w="full"
                onClick={onTryAgain}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Try Again
              </Button>
            )}
          </VStack>

          {/* Additional Info */}
          <MotionText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            fontSize="sm"
            color={useColorModeValue("gray.500", "gray.400")}
            textAlign="center"
            px={4}
          >
            If you believe this is an error, please contact your system
            administrator.
          </MotionText>
        </VStack>
      </MotionBox>
    </MotionBox>
  );
};

export default OrganizationErrorModal;
