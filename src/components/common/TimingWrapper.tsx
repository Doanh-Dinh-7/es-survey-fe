import { Box, Container, VStack, Spinner, Text } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { Survey } from "../../types/question.types";
import TimingStartForm from "./TimingStartForm";
import CountdownTimer from "./CountdownTimer";
import { startTimingSession } from "../../services/survey";

interface TimingSession {
  sessionId: string;
  startTime: Date;
  duration: number; // in minutes
  userEmail: string;
}

interface TimingWrapperProps {
  survey: Survey;
  children: React.ReactNode;
  onSessionStart: (session: TimingSession) => void;
  onSessionExpire: () => void;
  onSubmit: (sessionId: string) => Promise<void>;
}

const TimingWrapper: React.FC<TimingWrapperProps> = ({
  survey,
  children,
  onSessionStart,
  onSessionExpire,
  onSubmit,
}) => {
  const [session, setSession] = useState<TimingSession | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLoadedSession, setHasLoadedSession] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    if (hasLoadedSession) return; // Prevent multiple loads

    const savedSession = localStorage.getItem(`timing_session_${survey.id}`);
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        const sessionData = {
          ...parsedSession,
          startTime: new Date(parsedSession.startTime),
        };

        // Check if session is still valid
        const now = new Date();
        const sessionEndTime = new Date(
          sessionData.startTime.getTime() + sessionData.duration * 60 * 1000
        );

        if (now < sessionEndTime) {
          setSession(sessionData);
          onSessionStart(sessionData);
        } else {
          // Session expired, remove from localStorage
          localStorage.removeItem(`timing_session_${survey.id}`);
        }
      } catch (error) {
        localStorage.removeItem(`timing_session_${survey.id}`);
      }
    }
    setHasLoadedSession(true);
  }, [survey.id, onSessionStart, hasLoadedSession]);

  const handleStartSession = useCallback(
    async (email: string) => {
      setIsStarting(true);
      setError(null);

      try {
        const response = await startTimingSession(survey.id!, email);

        const sessionData: TimingSession = {
          sessionId: response.data.sessionId,
          startTime: new Date(response.data.startTime),
          duration: response.data.duration,
          userEmail: email,
        };

        // Save to localStorage
        localStorage.setItem(
          `timing_session_${survey.id}`,
          JSON.stringify(sessionData)
        );

        setSession(sessionData);
        onSessionStart(sessionData);
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "An error occurred"
        );
      } finally {
        setIsStarting(false);
      }
    },
    [survey.id, onSessionStart]
  );

  const handleTimeUp = useCallback(async () => {
    if (!session) return;

    try {
      // Auto-submit when time is up
      setIsSubmitting(true);
      await onSubmit(session.sessionId);

      // Clean up
      localStorage.removeItem(`timing_session_${survey.id}`);
      setSession(null);
      onSessionExpire();
    } catch (error) {
      // Still clean up the session
      localStorage.removeItem(`timing_session_${survey.id}`);
      setSession(null);
      onSessionExpire();
    } finally {
      setIsSubmitting(false);
    }
  }, [session, onSubmit, survey.id, onSessionExpire]);

  const handleWarning = useCallback(() => {
    // You can add notification logic here
    console.log("Time warning triggered");
  }, []);

  // Calculate remaining time in seconds (if session exists)
  const calculateRemainingTime = () => {
    if (!session) return 0;
    const now = new Date();
    const sessionEndTime = new Date(
      session.startTime.getTime() + session.duration * 60 * 1000
    );
    const remainingMs = sessionEndTime.getTime() - now.getTime();
    const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
    return remainingSeconds;
  };

  const remainingTimeInSeconds = calculateRemainingTime();

  // If time is up, auto-submit and cleanup (MUST be before early returns)
  useEffect(() => {
    if (remainingTimeInSeconds <= 0 && session) {
      handleTimeUp();
    }
  }, [remainingTimeInSeconds, session, handleTimeUp]);

  // Show start form if no session
  if (!session) {
    return (
      <Container maxW="md" py={10}>
        <TimingStartForm
          onStartSession={handleStartSession}
          isLoading={isStarting}
          error={error}
        />
      </Container>
    );
  }

  // Show loading if auto-submitting
  if (isSubmitting) {
    return (
      <Container maxW="md" py={10}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Submitting automatically...</Text>
        </VStack>
      </Container>
    );
  }

  // Show survey with timer
  return (
    <Box>
      <CountdownTimer
        duration={remainingTimeInSeconds}
        timeLimit={session.duration * 60}
        onTimeUp={handleTimeUp}
        onWarning={handleWarning}
        warningThreshold={60}
        isActive={true}
      />

      {children}
    </Box>
  );
};

export default TimingWrapper;
