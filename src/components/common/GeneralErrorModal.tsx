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
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

const MotionBox = motion(Box);
const MotionText = motion(Text);

interface GeneralErrorModalProps {
  onGoHome: () => void;
  onTryAgain?: () => void;
  errorMessage?: string;
  title?: string;
}

const GeneralErrorModal: React.FC<GeneralErrorModalProps> = ({
  onGoHome,
  onTryAgain,
  errorMessage = "Đã xảy ra lỗi trong quá trình xác thực.",
  title = "Lỗi xác thực",
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const iconColor = useColorModeValue("orange.500", "orange.400");

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
          >
            <Box
              bg={useColorModeValue("orange.50", "orange.900")}
              borderRadius="full"
              p={4}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiAlertTriangle} boxSize={8} color={iconColor} />
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
            {title}
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
              leftIcon={<FiHome />}
              colorScheme="blue"
              size="lg"
              w="full"
              onClick={onGoHome}
              _hover={{ transform: "translateY(-1px)" }}
              transition="all 0.2s"
            >
              Về trang chủ
            </Button>

            {onTryAgain && (
              <Button
                leftIcon={<FiRefreshCw />}
                variant="outline"
                size="lg"
                w="full"
                onClick={onTryAgain}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Thử lại
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
            Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ với hỗ trợ kỹ thuật.
          </MotionText>
        </VStack>
      </MotionBox>
    </MotionBox>
  );
};

export default GeneralErrorModal;
