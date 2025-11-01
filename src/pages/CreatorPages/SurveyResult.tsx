import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import {
  Flex,
  Text,
  Center,
  Container,
  useToast,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm";
import {
  changeStatusSurvey,
  ListResponseDetailSurvey,
  statisticsSurvey,
  deleteResponse,
} from "../../services/survey";
import socketService from "../../services/socket";
import { paths } from "../../routes/paths";
import SurveyInfoBar from "../../components/Survey/SurveyResult/SurveyInfoBar";
import QuestionBlock from "../../components/common/QuestionBlock";
import SurveyActionButtons from "../../components/Survey/SurveyResult/SurveyActionButtons";
import TabSwitcherWithAnimation from "../../components/Survey/SurveyResult/TabSwitcherWithAnimation";
import ResponseCard from "../../components/Survey/SurveyResult/ResponseCard";
import Pagination from "../../components/Survey/SurveyResult/Pagination";
import { useAuth0 } from "@auth0/auth0-react";

interface SurveyResult {
  surveyId: string;
  title: string;
  totalResponses: number;
  status: "PENDING" | "PUBLISHED" | "CLOSED";
  aiAnalysis: string | null;
  questions: {
    questionId: string;
    questionText: string;
    type: string;
    summary?: {
      optionText: string;
      count: number;
      percentage: number;
      value: string;
    }[];
    totalResponses: number;
  }[];
}

interface LocationState {
  surveyStatistics: SurveyResult;
}

interface ResponseDetail {
  responseId: string;
  userEmail: string;
  submittedAt: string;
  answers: {
    questionId: string;
    questionText: string;
    type: string;
    answer: string | string[];
  }[];
}

interface Question {
  id: string;
  surveyId: string;
  type: string;
  questionText: string;
  isRequired: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  options: {
    id: string;
    questionId: string;
    optionText: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

const SurveyResult: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleteResponseModalOpen, setIsDeleteResponseModalOpen] =
    useState(false);
  const [responseToDelete, setResponseToDelete] = useState<string | null>(null);
  const [isCloseSurveyLoading, setIsCloseSurveyLoading] = useState(false);
  const [isDeleteResponseLoading, setIsDeleteResponseLoading] = useState(false);
  const [responses, setResponses] = useState<ResponseDetail[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(1);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: surveyId } = useParams<{ id: string }>();
  const hasLoadedDataRef = useRef(false);
  const STORAGE_KEY = surveyId ? `survey_statistics_${surveyId}` : "";

  const [surveyStatistics, setSurveyStatistics] = useState<SurveyResult | null>(
    null
  );
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!surveyId) {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Survey ID is missing.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate(paths.root);
        return;
      }

      setIsLoading(true);

      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          setSurveyStatistics(JSON.parse(savedData));
        } catch (error) {
          console.error("Failed to parse saved survey data", error);
        }
      }

      try {
        const res = await statisticsSurvey(surveyId);
        setSurveyStatistics(res.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
      } catch (error) {
        console.error("Error getting statistic survey:", error);
        if (!savedData) {
          toast({
            title: "Failed to load survey data",
            description: "Could not fetch latest survey statistics.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyId, navigate, toast, STORAGE_KEY]);

  //  // Socket connection and event handling
  useEffect(() => {
    if (!surveyStatistics) return;

    const setupSocket = async () => {
      try {
        // Connect to socket
        const token = await getAccessTokenSilently({
          authorizationParams: {
            organization: import.meta.env.VITE_AUTH0_ORG_ID,
          },
        });

        console.log("Token", token);

        const socket = await socketService.connect(token);
        socketRef.current = socket as unknown as Socket;

        // Connection status handlers
        const handleConnect = () => {
          setIsSocketConnected(true);
          console.log("Socket connected");
        };

        const handleConnectError = (error: Error) => {
          setIsSocketConnected(false);
          console.error("Socket connection error:", error);
          toast({
            title: "Connection Error",
            description:
              "Failed to connect to real-time updates. Some features may be limited.",
            status: "warning",
            duration: 5000,
            isClosable: true,
            variant: "solid",
          });
        };

        const handleDisconnect = (reason: string) => {
          setIsSocketConnected(false);
          console.log("Socket disconnected:", reason);
          if (reason === "io server disconnect") {
            // Server initiated disconnect, try to reconnect
            socketService.connect(token);
          }
        };

        // Add connection status listeners
        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("disconnect", handleDisconnect);

        // Handle statistics updates
        const handleStatisticsUpdate = (statistics: any) => {
          console.log("Received statistics update:", statistics);
          setSurveyStatistics((prev) => {
            if (prev) {
              // Update local storage with new statistics
              const updatedStats = { ...prev, ...statistics };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats));
              return updatedStats;
            }
            return null;
          });
        };

        // Handle new responses
        const handleNewResponse = (response: any) => {
          console.log("New response received:", response);
          setResponses((prev) => {
            const updatedResponses = [...prev, response];
            // Update current page if we're on the last page
            if (currentResponseIndex === prev.length) {
              setCurrentResponseIndex(updatedResponses.length);
            }
            return updatedResponses;
          });
        };

        // Handle deleted responses
        const handleResponseDelete = (responseId: string) => {
          console.log("Response deleted:", responseId);
          setResponses((prev) => {
            const updatedResponses = prev.filter(
              (r) => r.responseId !== responseId
            );
            // Adjust current page if needed
            if (currentResponseIndex > updatedResponses.length) {
              setCurrentResponseIndex(Math.max(1, updatedResponses.length));
            }
            return updatedResponses;
          });
        };

        // Join survey room and set up listeners
        socketService.joinSurvey(
          surveyStatistics.surveyId,
          handleStatisticsUpdate
        );

        // Set up other event listeners
        socketService.onResponseUpdate(handleNewResponse);
        socketService.onResponseDelete(handleResponseDelete);

        // Initial connection
        if (socket.connected) {
          handleConnect();
        }

        // Cleanup function
        return () => {
          if (socket) {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.off("disconnect", handleDisconnect);
          }

          // Remove specific event listeners
          if (handleStatisticsUpdate) {
            socketService.off(
              "survey:statistics:update",
              handleStatisticsUpdate
            );
          }
          if (handleNewResponse) {
            socketService.off("survey:response:update", handleNewResponse);
          }
          if (handleResponseDelete) {
            socketService.off("survey:response:delete", handleResponseDelete);
          }

          // Leave the room
          socketService.leaveSurvey(surveyStatistics.surveyId);
        };
      } catch (error) {
        console.error("Failed to set up socket connection:", error);
        toast({
          title: "Connection Error",
          description: "Failed to establish real-time connection",
          status: "error",
          duration: 5000,
          isClosable: true,
          variant: "solid",
        });
      }
    };

    setupSocket();
  }, [surveyStatistics, currentResponseIndex, toast]);

  const fetchResponses = async () => {
    if (!surveyStatistics) return;

    setIsLoading(true);
    try {
      const res = await ListResponseDetailSurvey(surveyStatistics.surveyId);
      setResponses(res.data.responses || []);
      const convertedQuestions: Question[] = (
        surveyStatistics.questions || []
      ).map((q: any) => ({
        id: q.questionId,
        surveyId: surveyStatistics.surveyId,
        type: q.type,
        questionText: q.questionText,
        isRequired: q.isRequired ?? false,
        order: q.order ?? 0,
        createdAt: q.createdAt ?? "",
        updatedAt: q.updatedAt ?? "",
        options: q.options ?? [],
      }));
      setQuestions(convertedQuestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load responses",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
      setResponses([]);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tabIndex === 1) {
      fetchResponses();
      setTimeout(() => {
        console.log("questions:", questions);
        console.log("responses:", responses);
      }, 1000);
    }
  }, [tabIndex]);

  // Load data on mount
  useEffect(() => {
    if (hasLoadedDataRef.current) return;

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setSurveyStatistics(JSON.parse(savedData));
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
    hasLoadedDataRef.current = true;
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (surveyStatistics) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(surveyStatistics));
    }
  }, [surveyStatistics]);

  // Clear data when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasLoadedDataRef.current && location.pathname === paths.surveyResult)
        return;
      localStorage.removeItem(STORAGE_KEY);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      localStorage.removeItem(STORAGE_KEY);
    };
  }, [location.pathname]);

  if (!surveyStatistics || !surveyStatistics.questions) {
    return (
      <Center h="100vh">
        <Text>No survey data found</Text>
      </Center>
    );
  }

  const handleClose = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClose = async () => {
    setIsCloseSurveyLoading(true);
    try {
      const res = await changeStatusSurvey(surveyStatistics.surveyId);
      if (res.statusCode === 200) {
        toast({
          title: "Survey closed",
          description: res.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          variant: "solid",
        });
      }
      setSurveyStatistics((prev) => {
        if (prev) {
          return { ...prev, status: "CLOSED" };
        }
        return null;
      });
    } catch (error: any) {
      toast({
        title: "Failed to close survey",
        description: error?.response?.data?.message || "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    } finally {
      setIsCloseSurveyLoading(false);
      setIsConfirmModalOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentResponseIndex(page);
  };

  const handleDeleteResponse = (responseId: string) => {
    setResponseToDelete(responseId);
    setIsDeleteResponseModalOpen(true);
  };

  const handleConfirmDeleteResponse = async () => {
    if (!responseToDelete || !surveyStatistics) return;

    setIsDeleteResponseLoading(true);
    try {
      await deleteResponse(surveyStatistics.surveyId, responseToDelete);

      // Emit socket event for real-time update
      if (socketRef.current) {
        socketService.deleteResponse(
          surveyStatistics.surveyId,
          responseToDelete
        );
      }

      // Remove response from local state
      setResponses((prev) => {
        const updatedResponses = prev.filter(
          (r) => r.responseId !== responseToDelete
        );

        // Adjust current page if needed
        if (currentResponseIndex > updatedResponses.length) {
          setCurrentResponseIndex(Math.max(1, updatedResponses.length));
        }

        return updatedResponses;
      });

      toast({
        title: "Response deleted",
        description: "Response has been successfully deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete response",
        description: error?.response?.data?.message || "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    } finally {
      setIsDeleteResponseLoading(false);
      setIsDeleteResponseModalOpen(false);
      setResponseToDelete(null);
    }
  };

  return (
    <Flex direction="column" align="center" w="100%" mt={10}>
      <Flex w="100%" justify="flex-end">
        <SurveyActionButtons onClose={handleClose} survey={surveyStatistics} />
      </Flex>
      <Container maxW="4xl" py={6}>
        <SurveyInfoBar title={surveyStatistics.title} />
        <TabSwitcherWithAnimation tabIndex={tabIndex} setTabIndex={setTabIndex}>
          {tabIndex === 0 && (
            <>
              {surveyStatistics?.aiAnalysis && (
                <Alert
                  status="info"
                  position="relative"
                  mb={6}
                  p={5}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="blue.300"
                  boxShadow="md"
                >
                  <AlertIcon position="absolute" top={2} left={2} />
                  <Text
                    whiteSpace="pre-line"
                    mt={3}
                    color="blue.900"
                    fontWeight="500"
                    textAlign="left"
                  >
                    {surveyStatistics.aiAnalysis}
                  </Text>
                </Alert>
              )}
              {surveyStatistics.questions.map((question) => (
                <QuestionBlock key={question.questionId} question={question} />
              ))}
            </>
          )}
          {tabIndex === 1 && (
            <>
              {isLoading ? (
                <Center py={10}>
                  <Spinner size="xl" />
                </Center>
              ) : responses.length > 0 ? (
                <VStack spacing={4} align="stretch">
                  <Pagination
                    currentPage={currentResponseIndex}
                    totalPages={responses.length}
                    onPageChange={handlePageChange}
                  />
                  <ResponseCard
                    response={responses[currentResponseIndex - 1]}
                    questions={questions}
                    onDelete={handleDeleteResponse}
                  />
                  <Pagination
                    currentPage={currentResponseIndex}
                    totalPages={responses.length}
                    onPageChange={handlePageChange}
                  />
                </VStack>
              ) : (
                <Center py={10}>
                  <Text>No responses found</Text>
                </Center>
              )}
            </>
          )}
        </TabSwitcherWithAnimation>
      </Container>

      {surveyStatistics.status === "PUBLISHED" && (
        <ModalConfirm
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setIsCloseSurveyLoading(false);
          }}
          onConfirm={handleConfirmClose}
          title="Close Survey"
          message="Are you sure you want to close?"
          loading={isCloseSurveyLoading}
        />
      )}

      <ModalConfirm
        isOpen={isDeleteResponseModalOpen}
        onClose={() => {
          setIsDeleteResponseModalOpen(false);
          setResponseToDelete(null);
          setIsDeleteResponseLoading(false);
        }}
        onConfirm={handleConfirmDeleteResponse}
        title="Delete Response"
        message="Are you sure you want to delete this response? This action cannot be undone."
        confirmColorScheme="red"
        loading={isDeleteResponseLoading}
      />
    </Flex>
  );
};

export default SurveyResult;
