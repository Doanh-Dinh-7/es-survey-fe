import {
  Box,
  Text,
  Progress,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  duration: number; // in seconds
  timeLimit: number; // in seconds
  onTimeUp?: () => void;
  onWarning?: () => void;
  warningThreshold?: number; // seconds before warning (default: 60)
  isActive?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration,
  timeLimit,
  onTimeUp,
  onWarning,
  warningThreshold = 60,
  isActive = true,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [hasWarned, setHasWarned] = useState(false);

  // Update timeRemaining when duration prop changes (e.g., on page refresh)
  useEffect(() => {
    setTimeRemaining(duration);
    setHasWarned(false); // Reset warning state
  }, [duration]);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        // Trigger warning
        if (newTime <= warningThreshold && !hasWarned) {
          setHasWarned(true);
          onWarning?.();
        }

        // Trigger time up
        if (newTime <= 0) {
          onTimeUp?.();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    isActive,
    timeRemaining,
    onTimeUp,
    onWarning,
    warningThreshold,
    hasWarned,
  ]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  const progressValue = (timeRemaining / timeLimit) * 100;
  const isWarning = timeRemaining <= warningThreshold;
  const isCritical = timeRemaining <= 30;

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      position="sticky"
      top={4}
      zIndex={10}
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      boxShadow="sm"
      mb={4}
    >
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Time remaining:
          </Text>
          <Badge
            colorScheme={isCritical ? "red" : isWarning ? "orange" : "green"}
            fontSize="sm"
            px={2}
            py={1}
            borderRadius="md"
          >
            {formatTime(timeRemaining)}
          </Badge>
        </HStack>

        <Progress
          value={progressValue}
          colorScheme={isCritical ? "red" : isWarning ? "orange" : "green"}
          size="sm"
          borderRadius="md"
          bg="gray.100"
        />

        {isWarning && (
          <Alert
            status={isCritical ? "error" : "warning"}
            borderRadius="md"
            py={2}
          >
            <AlertIcon />
            <Text fontSize="sm">
              {isCritical
                ? "Time is running out! Please complete the survey as soon as possible."
                : "Warning: Time is running out!"}
            </Text>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default CountdownTimer;
