import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Progress,
  useToast,
  Input,
  Textarea,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Stack,
  Alert,
  AlertIcon,
  Skeleton,
  SkeletonText,
  Fade,
  Flex,
  Image,
  SlideFade,
  FormControl,
  FormErrorMessage,
  AspectRatio,
} from "@chakra-ui/react";
import { Question, Survey } from "../types/question.types";
import { SubmitSurveyPayload } from "../services/survey";
import { getSurveyById, SubmitSurvey } from "../services/survey";
import Logo from "../components/Navbar/Logo";
import ImagePreviewModal from "../components/common/ImagePreviewModal";
import MatrixChoicePreview from "../components/Survey/SurveyPreview/MatrixChoicePreview";
import MatrixInputPreview from "../components/Survey/SurveyPreview/MatrixInputPreview";
import { TimingWrapper } from "../components/common";
interface LocationState {
  survey: Survey;
  isPreview?: boolean;
}

const SurveyPreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { survey: previewSurvey, isPreview } =
    (location.state as LocationState) || {};
  const [survey, setSurvey] = useState<Survey | null>(previewSurvey || null);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const savedAnswers = localStorage.getItem(`survey_answers_${id}`);
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSurveyLoading, setIsSurveyLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState<string>(() => {
    const savedEmail = localStorage.getItem(`user_email_${id}`);
    return savedEmail || "";
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [questionErrors, setQuestionErrors] = useState<
    Record<string, string | null>
  >({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [timingSession, setTimingSession] = useState<{
    sessionId: string;
    startTime: Date;
    duration: number;
    userEmail: string;
  } | null>(null);

  useEffect(() => {
    const fetchSurveyData = async () => {
      setIsSurveyLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!id || isPreview) {
        if (isPreview && previewSurvey) {
          setSurvey(previewSurvey);
        }
        setIsSurveyLoading(false);
        return;
      }

      try {
        const response = await getSurveyById(id);
        setSurvey(response.data);
      } catch (error: any) {
        if (error?.response?.status === 403) {
          if (error?.response?.data?.message === "Survey is not published") {
            setIsClosed(true);
          } else if (
            error?.response?.data?.message ===
            "You have already submitted this survey"
          ) {
            setIsAlreadySubmitted(true);
          } else {
            setIsClosed(true);
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to load survey. Please try again later.",
            status: "error",
            duration: 3000,
            isClosable: true,
            variant: "solid",
          });
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setIsSurveyLoading(false);
      }
    };

    fetchSurveyData();
  }, [id, isPreview, navigate, toast, previewSurvey]);

  useEffect(() => {
    if (survey?.id) {
      localStorage.setItem(
        `survey_answers_${survey.id}`,
        JSON.stringify(answers)
      );
    }
  }, [answers, survey?.id]);

  // Save userEmail to localStorage when it changes
  useEffect(() => {
    if (id && userEmail) {
      localStorage.setItem(`user_email_${id}`, userEmail);
    }
  }, [userEmail, id]);

  // Timing handlers - MUST be before any early returns
  const handleTimingSessionStart = useCallback(
    (session: {
      sessionId: string;
      startTime: Date;
      duration: number;
      userEmail: string;
    }) => {
      setTimingSession(session);
      if (session.userEmail) {
        setUserEmail(session.userEmail);
      }
    },
    []
  );

  const handleTimingSessionExpire = useCallback(() => {
    setTimingSession(null);
    toast({
      title: "Session expired",
      description: "Your timing session has expired. Please start again.",
      status: "warning",
      duration: 5000,
      isClosable: true,
      variant: "solid",
    });
  }, [toast]);

  const handleTimingSubmit = useCallback(
    async (sessionId: string) => {
      const formattedAnswers = Object.entries(answers)
        .map(([questionId, answer]) => {
          if (!survey || !survey.questions) return null;
          const question = survey.questions.find((q) => q.id === questionId);
          if (!question) return null;

          if (
            typeof answer === "object" &&
            answer !== null &&
            (question.type === "multiple_choice" ||
              question.type === "checkbox")
          ) {
            const baseAnswer =
              question.type === "multiple_choice"
                ? answer.optionId
                : answer.optionIds.join(",");
            const customText = answer.customText;

            const formatted = {
              questionId: questionId,
              answer: baseAnswer,
            };

            if (customText) {
              (formatted as any).customText = customText;
            }
            return formatted;
          } else if (Array.isArray(answer)) {
            return {
              questionId: questionId,
              answer: answer.join(","),
            };
          }
          return {
            questionId: questionId,
            answer: answer,
          };
        })
        .filter(Boolean);

      const payload: SubmitSurveyPayload = {
        answers: formattedAnswers,
        userEmail: timingSession?.userEmail || userEmail,
        sessionId: sessionId,
      };

      await SubmitSurvey(id!, payload);
      setIsSubmitted(true);
      if (survey?.id) {
        localStorage.removeItem(`survey_answers_${survey.id}`);
      }
    },
    [answers, survey, userEmail, id, timingSession]
  );

  function smoothScrollToTop(duration = 800) {
    const start = window.scrollY;
    const startTime = performance.now();

    function scrollStep(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // từ 0 -> 1
      const easeInOutQuad =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      window.scrollTo(0, start * (1 - easeInOutQuad));

      if (elapsed < duration) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  }

  useEffect(() => {
    // window.scrollTo({ top: 0, behavior: "smooth" });
    smoothScrollToTop(1000);
  }, [location.pathname]);

  const handleOpenPreview = (url: string) => {
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
    setIsPreviewOpen(false);
  };

  if (isSurveyLoading) {
    return (
      <Container
        maxW="3xl"
        py={10}
        bg="white.primary"
        borderRadius="10px"
        border="1px solid"
        borderColor="gray.200"
        p={8}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={10}
        >
          <Logo />
        </Box>
        <Fade in={true} transition={{ enter: { duration: 0.5 } }}>
          <VStack spacing={6} align="stretch" w="100%">
            <Skeleton height="48px" width="70%" justifyItems="center" />
            <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="4" />
            <Box mt={8}>
              {[...Array(3)].map((_, i) => (
                <SlideFade
                  in={true}
                  offsetY="50px"
                  transition={{ enter: { duration: 1 + i * 0.5 } }}
                  key={i}
                >
                  <Box
                    mb={6}
                    border="1px solid"
                    borderColor="gray.200"
                    p={4}
                    borderRadius="md"
                  >
                    <Skeleton height="24px" width="90%" mb={4} />
                    <SkeletonText
                      mt="4"
                      noOfLines={3}
                      spacing="4"
                      width="100%"
                    />
                  </Box>
                </SlideFade>
              ))}
            </Box>
          </VStack>
        </Fade>
      </Container>
    );
  }

  if (isClosed) {
    return (
      <Container
        maxW="3xl"
        py={10}
        bg="white.primary"
        borderRadius="10px"
        border="1px solid"
        borderColor="gray.200"
        p={8}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={10}
        >
          <Logo />
        </Box>
        <Fade in={true} transition={{ enter: { duration: 1 } }}>
          <VStack spacing={6} align="stretch">
            <Alert status="warning" borderRadius="md" fontSize="md">
              <AlertIcon />
              This survey has been closed.
            </Alert>
            <Box
              alignSelf="center"
              borderRadius="20px"
              overflow="hidden"
              boxShadow="md"
            >
              <Image
                src="https://www.riverwoods.gov/sites/g/files/vyhlif13531/files/styles/full_node_primary/public/media/rc/image/7071/survey_closed.png?itok=3lkRT_Zg"
                alt="Survey Closed"
                width="100%"
                height="100%"
                objectFit="contain"
              />
            </Box>
          </VStack>
        </Fade>
      </Container>
    );
  }

  if (isAlreadySubmitted) {
    return (
      <Container
        maxW="3xl"
        py={10}
        bg="white.primary"
        borderRadius="10px"
        border="1px solid"
        borderColor="gray.200"
        p={8}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={10}
        >
          <Logo />
        </Box>
        <Fade in={true} transition={{ enter: { duration: 1 } }}>
          <VStack spacing={6} align="stretch">
            <Alert status="info">
              <AlertIcon />
              You have already submitted this survey. Thank you!
            </Alert>
          </VStack>
        </Fade>
      </Container>
    );
  }

  if (!survey || !survey.questions) {
    return (
      <Container
        maxW="3xl"
        py={10}
        bg="white.primary"
        borderRadius="10px"
        border="1px solid"
        borderColor="gray.200"
        p={8}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={10}
        >
          <Logo />
        </Box>
        <Fade in={true} transition={{ enter: { duration: 1 } }}>
          <VStack spacing={6} align="stretch">
            <Alert status="error">
              <AlertIcon />
              The survey could not be loaded or was not found.
            </Alert>
          </VStack>
        </Fade>
      </Container>
    );
  }

  const questionsPerPage = Math.min(survey.questions.length, 10);
  const totalPages = Math.ceil(survey.questions.length / questionsPerPage);
  const progress = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0;

  const startIdx = currentPage * questionsPerPage;
  const endIdx = startIdx + questionsPerPage;
  const currentQuestions = survey.questions.slice(startIdx, endIdx);

  const currentQuestion =
    survey!.questions[Math.min(currentPage, survey!.questions.length - 1)];

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => {
      if (!survey || !survey.questions) {
        console.error("Survey or survey questions are not available.");
        return prev;
      }
      const question = survey.questions.find((q) => q.id === questionId);
      if (!question) return prev;

      if (question.type === "multiple_choice") {
        const selectedOption = question.options?.find(
          (opt) => String(opt.id) === String(value)
        );
        if (selectedOption?.isOther) {
          // If "other" is selected, store an object with optionId and an empty customText
          return {
            ...prev,
            [questionId]: {
              optionId: value,
              customText: prev[questionId]?.customText || "", // Preserve existing custom text if any
            },
          };
        } else {
          // For regular multiple choice, store just the optionId
          return {
            ...prev,
            [questionId]: value,
          };
        }
      } else if (question.type === "checkbox") {
        // 'value' for checkbox is an array of selected option IDs
        const newSelectedOptions = Array.isArray(value) ? value : [value];
        const isOtherOptionSelected = newSelectedOptions.some(
          (optId) =>
            question.options?.find((opt) => String(opt.id) === String(optId))
              ?.isOther
        );

        // Luôn lưu dưới dạng object
        return {
          ...prev,
          [questionId]: {
            optionIds: newSelectedOptions,
            customText: prev[questionId]?.customText || "",
          },
        };
      }

      // For short_text, long_text, just store the value directly
      return {
        ...prev,
        [questionId]: value,
      };
    });
    setQuestionErrors((prev) => ({ ...prev, [questionId]: null })); // Clear error when answer changes
  };

  const handleCustomTextChange = (questionId: string, text: string) => {
    setAnswers((prev) => {
      const currentAnswer = prev[questionId];
      if (typeof currentAnswer === "object" && currentAnswer !== null) {
        return {
          ...prev,
          [questionId]: {
            ...currentAnswer,
            customText: text,
          },
        };
      }
      return prev; // Should not happen if logic is correct
    });
  };

  const handleNext = async () => {
    // Email validation before final submission
    if (survey?.settings?.requireEmail && !isPreview) {
      if (!userEmail) {
        setEmailError("Email is not empty!");
        return;
      }
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userEmail)) {
        setEmailError("Invalid email!");
        return;
      }
    }
    // Validate current page questions before proceeding
    const newQuestionErrors: Record<string, string | null> = {};
    let hasError = false;

    if (!survey || !survey.questions) {
      console.error(
        "Survey or survey questions are not available for validation."
      );
      return; // Exit if survey or questions are not available
    }

    const questionsToValidate =
      currentPage === totalPages - 1 ? survey.questions : currentQuestions;

    questionsToValidate.forEach((question) => {
      if (question.isRequired) {
        const answer = answers[question.id!];

        // Validation cho matrix questions
        if (
          question.type === "matrix_choice" ||
          question.type === "matrix_input"
        ) {
          if (
            !answer ||
            typeof answer !== "object" ||
            Object.keys(answer).length === 0
          ) {
            newQuestionErrors[question.id!] = "Can not be left blank.";
            hasError = true;
          } else if (question.type === "matrix_choice") {
            // Kiểm tra tất cả rows đã được chọn
            const requiredRows = question.matrixRows?.length || 0;
            const answeredRows = Object.keys(answer).length;
            if (answeredRows < requiredRows) {
              newQuestionErrors[question.id!] = "Please answer all rows.";
              hasError = true;
            }
          } else if (question.type === "matrix_input") {
            // Kiểm tra tất cả cells đã được điền
            const requiredCells =
              (question.matrixRows?.length || 0) *
              (question.matrixColumns?.length || 0);
            const answeredCells = Object.values(answer).filter(
              (val) => val && String(val).trim()
            ).length;
            if (answeredCells < requiredCells) {
              newQuestionErrors[question.id!] = "Please fill all cells.";
              hasError = true;
            }
          }
        } else if (
          !answer ||
          (Array.isArray(answer) && answer.length === 0) ||
          (typeof answer === "object" &&
            answer !== null &&
            !answer.optionId &&
            (!answer.optionIds || answer.optionIds.length === 0))
        ) {
          newQuestionErrors[question.id!] = "Can not be left blank.";
          hasError = true;
        } else if (
          typeof answer === "object" &&
          answer !== null &&
          answer.isOther &&
          !answer.customText
        ) {
          newQuestionErrors[question.id!] = "Can not be left blank.";
          hasError = true;
        }
      }
    });

    setQuestionErrors(newQuestionErrors);

    if (hasError) {
      toast({
        title: "Invalid Submission",
        description: "Please answer all required questions.",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
      return;
    }

    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      const formattedAnswers = Object.entries(answers)
        .map(([questionId, answer]) => {
          if (!survey || !survey.questions) {
            console.error(
              "Survey or survey questions are not available during submission."
            );
            return null;
          }
          const question = survey.questions.find((q) => q.id === questionId);
          if (!question) return null;

          // Xử lý matrix questions
          if (
            question.type === "matrix_choice" ||
            question.type === "matrix_input"
          ) {
            if (
              typeof answer === "object" &&
              answer !== null &&
              !Array.isArray(answer)
            ) {
              const matrixAnswers: any[] = [];

              if (question.type === "matrix_choice") {
                // Format: { rowId: columnId, ... }
                Object.entries(answer).forEach(([rowKey, columnId]) => {
                  matrixAnswers.push({
                    rowId: rowKey,
                    columnId: columnId,
                  });
                });
              } else if (question.type === "matrix_input") {
                // Format: { "rowId_columnId": "value", ... }
                Object.entries(answer).forEach(([key, value]) => {
                  if (value && String(value).trim()) {
                    const [rowId, columnId] = key.split("_");
                    matrixAnswers.push({
                      rowId: rowId,
                      columnId: columnId,
                      inputValue: String(value),
                    });
                  }
                });
              }

              return {
                questionId: questionId,
                answer: "matrix", // Placeholder để pass validation
                matrixAnswers: matrixAnswers,
              };
            }
          }

          if (
            typeof answer === "object" &&
            answer !== null &&
            (question.type === "multiple_choice" ||
              question.type === "checkbox")
          ) {
            const baseAnswer =
              question.type === "multiple_choice"
                ? answer.optionId
                : answer.optionIds.join(",");
            const customText = answer.customText;

            const formatted = {
              questionId: questionId,
              answer: baseAnswer,
            };

            if (customText) {
              // Only add customText if it's not empty
              (formatted as any).customText = customText;
            }
            return formatted;
          } else if (Array.isArray(answer)) {
            // This case handles checkbox without "other" option
            return {
              questionId: questionId,
              answer: answer.join(","),
            };
          }
          return {
            questionId: questionId,
            answer: answer,
          };
        })
        .filter(Boolean); // Remove null entries if any

      try {
        if (!isPreview && id) {
          const payload: SubmitSurveyPayload = {
            answers: formattedAnswers,
          };
          if (survey.settings?.requireEmail) {
            payload.userEmail = userEmail;
          }
          if (timingSession) {
            payload.sessionId = timingSession.sessionId;
          }
          await SubmitSurvey(id, payload);
        }
        setIsSubmitted(true);
        if (survey.id) {
          localStorage.removeItem(`survey_answers_${survey.id}`);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit survey. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
          variant: "solid",
        });
      }
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const renderQuestion = (question: Question) => {
    if (!question.id) return null;

    const questionId = question.id;
    const error = questionErrors[questionId];

    switch (question.type) {
      case "short_text":
        return (
          <FormControl isInvalid={!!error} isRequired={question.isRequired}>
            <Input
              value={answers[questionId] || ""}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
              placeholder="Enter your answer"
              fontSize="sm"
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>
        );
      case "long_text":
        return (
          <FormControl isInvalid={!!error} isRequired={question.isRequired}>
            <Textarea
              value={answers[questionId] || ""}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
              placeholder="Enter your answer"
              fontSize="sm"
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>
        );
      case "multiple_choice":
        const selectedOptionId =
          typeof answers[questionId] === "object"
            ? answers[questionId]?.optionId
            : answers[questionId];
        const selectedOptionIsOther = question.options?.find(
          (option) => String(option.id) === String(selectedOptionId)
        )?.isOther;

        return (
          <FormControl isInvalid={!!error} isRequired={question.isRequired}>
            <VStack align="stretch">
              <RadioGroup
                value={selectedOptionId || ""}
                onChange={(value) => handleAnswerChange(questionId, value)}
              >
                <Stack display="block">
                  {question.options?.map((option, index) => (
                    <Flex
                      key={index}
                      align="start"
                      w="full"
                      boxShadow={option.optionMediaUrl ? "md" : "none"}
                      borderRadius="md"
                      p={2}
                      _hover={{
                        border: "1px solid",
                        borderColor: "blue.300",
                      }}
                      display="flex"
                      justifyContent={"space-between"}
                      mb={2}
                    >
                      <Radio key={option.id} value={String(option.id)}>
                        {option.optionText}
                      </Radio>
                      {option.optionMediaUrl && (
                        <Image
                          src={
                            import.meta.env.VITE_BACKEND_DOMAIN +
                            option.optionMediaUrl
                          }
                          alt={`Option ${option.id}`}
                          objectFit="contain"
                          borderRadius="md"
                          maxW="7vw"
                          maxH="10vh"
                          w="auto"
                          h="auto"
                          cursor="pointer"
                          onClick={() =>
                            handleOpenPreview(
                              import.meta.env.VITE_BACKEND_DOMAIN +
                                option.optionMediaUrl
                            )
                          }
                        />
                      )}
                    </Flex>
                  ))}
                </Stack>
              </RadioGroup>
              {selectedOptionIsOther && (
                <Input
                  mt={2}
                  placeholder="Please specify"
                  value={answers[questionId]?.customText || ""}
                  onChange={(e) =>
                    handleCustomTextChange(questionId, e.target.value)
                  }
                  fontSize="sm"
                />
              )}
            </VStack>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>
        );
      case "checkbox":
        const selectedOptionIds = answers[questionId]?.optionIds || [];
        const isOtherOptionInCheckboxSelected = selectedOptionIds.some(
          (optId: string) =>
            question.options?.find((opt) => String(opt.id) === String(optId))
              ?.isOther
        );

        return (
          <FormControl isInvalid={!!error} isRequired={question.isRequired}>
            <VStack align="stretch">
              <CheckboxGroup
                value={selectedOptionIds}
                onChange={(value) => handleAnswerChange(questionId, value)}
              >
                <Stack display="block">
                  {question.options?.map((option, index) => (
                    <Flex
                      key={index}
                      align="start"
                      w="full"
                      boxShadow={option.optionMediaUrl ? "md" : "none"}
                      borderRadius="md"
                      p={2}
                      _hover={{
                        border: "1px solid",
                        borderColor: "blue.300",
                      }}
                      display="flex"
                      justifyContent={"space-between"}
                      mb={2}
                    >
                      <Checkbox key={option.id} value={String(option.id)}>
                        {option.optionText}
                      </Checkbox>
                      {option.optionMediaUrl && (
                        <Image
                          src={
                            import.meta.env.VITE_BACKEND_DOMAIN +
                            option.optionMediaUrl
                          }
                          alt={`Option ${option.id}`}
                          objectFit="contain"
                          borderRadius="md"
                          maxW="7vw"
                          maxH="10vh"
                          w="auto"
                          h="auto"
                          cursor="pointer"
                          onClick={() =>
                            handleOpenPreview(
                              import.meta.env.VITE_BACKEND_DOMAIN +
                                option.optionMediaUrl
                            )
                          }
                        />
                      )}
                    </Flex>
                  ))}
                </Stack>
              </CheckboxGroup>
              {isOtherOptionInCheckboxSelected && (
                <Input
                  mt={2}
                  placeholder="Please specify"
                  value={answers[questionId]?.customText || ""}
                  onChange={(e) =>
                    handleCustomTextChange(questionId, e.target.value)
                  }
                  fontSize="sm"
                />
              )}
            </VStack>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>
        );
      case "matrix_choice":
        return (
          <MatrixChoicePreview
            questionId={questionId}
            matrixRows={question.matrixRows || []}
            matrixColumns={question.matrixColumns || []}
            value={answers[questionId] || {}}
            onChange={(value) => handleAnswerChange(questionId, value)}
            isRequired={question.isRequired}
            error={error}
          />
        );
      case "matrix_input":
        return (
          <MatrixInputPreview
            questionId={questionId}
            matrixRows={question.matrixRows || []}
            matrixColumns={question.matrixColumns || []}
            value={answers[questionId] || {}}
            onChange={(value) => handleAnswerChange(questionId, value)}
            isRequired={question.isRequired}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <Container
        maxW="3xl"
        py={10}
        bg="white.primary"
        flexDirection="column"
        borderRadius="10px"
        border="1px solid"
        borderColor="gray.200"
        p={8}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={10}
        >
          <Logo />
          {isPreview && (
            <Button
              colorScheme="warning"
              variant="outline"
              onClick={() =>
                navigate("/survey-editor", {
                  state: { mode: "edit", survey: survey },
                })
              }
            >
              Back to Edit
            </Button>
          )}
        </Box>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            {survey.settings?.responseLetter || "Thank you for your responses!"}
          </Heading>
          <Button colorScheme="blue" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container
      maxW="3xl"
      py={10}
      bg="white.primary"
      flexDirection="column"
      borderRadius="10px"
      border="1px solid"
      borderColor="gray.200"
      p={8}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={10}
      >
        <Logo />
        {isPreview && (
          <Button
            colorScheme="warning"
            variant="outline"
            onClick={() =>
              navigate("/survey-editor", {
                state: { mode: "edit", survey: survey },
              })
            }
          >
            Back to Edit
          </Button>
        )}
      </Box>
      {survey && survey.settings?.enableTiming && !isPreview ? (
        <TimingWrapper
          survey={survey}
          onSessionStart={handleTimingSessionStart}
          onSessionExpire={handleTimingSessionExpire}
          onSubmit={handleTimingSubmit}
        >
          <Fade in={true} transition={{ enter: { duration: 1 } }}>
            <VStack spacing={6} align="stretch">
              {renderSurveyContent()}
            </VStack>
          </Fade>
        </TimingWrapper>
      ) : (
        <Fade in={true} transition={{ enter: { duration: 1 } }}>
          <VStack spacing={6} align="stretch">
            {renderSurveyContent()}
          </VStack>
        </Fade>
      )}

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        imageUrl={previewUrl}
      />
    </Container>
  );

  function renderSurveyContent() {
    return (
      <>
        {currentPage === 0 && survey && (
          <>
            <Heading as="h1" size="lg">
              {survey.title}
            </Heading>
            <Text as="h2" fontSize="md">
              {survey.description}
            </Text>

            {survey.surveyMediaUrl && (
              <AspectRatio
                ratio={16 / 9}
                width="100%"
                mb={2}
                borderRadius="md"
                overflow="hidden"
              >
                <Image
                  src={
                    import.meta.env.VITE_BACKEND_DOMAIN + survey.surveyMediaUrl
                  }
                  alt="Survey Media"
                  objectFit="contain"
                  cursor="pointer"
                  onClick={() =>
                    handleOpenPreview(
                      import.meta.env.VITE_BACKEND_DOMAIN +
                        survey.surveyMediaUrl
                    )
                  }
                />
              </AspectRatio>
            )}
            <hr />
            <Text textAlign="left" color="error">
              * Indicates required question
            </Text>
          </>
        )}
        {survey &&
          survey.settings?.requireEmail &&
          !survey.settings?.enableTiming && (
            <FormControl isInvalid={!!emailError} isRequired>
              <Box
                mb={6}
                border="1px solid"
                borderColor="gray.200"
                p={4}
                borderRadius="md"
              >
                <Flex justify="center" gap="2" textAlign="center">
                  <Text
                    mb={4}
                    fontSize="lg"
                    fontWeight="bold"
                    fontStyle="italic"
                  >
                    Email
                  </Text>
                  <Text fontSize="sm" color="red">
                    *
                  </Text>
                </Flex>

                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                    setEmailError(null);
                  }}
                />
                {emailError && (
                  <FormErrorMessage>{emailError}</FormErrorMessage>
                )}
              </Box>
            </FormControl>
          )}

        <Box>
          {survey && survey.questions && survey.questions.length <= 4
            ? survey.questions.map((question) => (
                <Box
                  key={question.id}
                  mb={6}
                  border="1px solid"
                  borderColor="gray.200"
                  p={4}
                  borderRadius="md"
                >
                  <Flex
                    justify="center"
                    textAlign="center"
                    direction="column"
                    mb={2}
                  >
                    <Flex justify="center">
                      <Text mb={4} fontSize="lg" fontWeight="bold">
                        {question.questionText}
                      </Text>
                      <Text fontSize="sm" color="red">
                        {question.isRequired ? "*" : ""}
                      </Text>
                    </Flex>
                    <Flex textAlign="center" justify="center">
                      {question.questionMediaUrl && (
                        <Image
                          src={
                            import.meta.env.VITE_BACKEND_DOMAIN +
                            question.questionMediaUrl
                          }
                          alt={`Question ${question.id}`}
                          objectFit="contain"
                          borderRadius="md"
                          maxW="10vw"
                          maxH="17vh"
                          w="auto"
                          h="auto"
                          cursor="pointer"
                          onClick={() =>
                            handleOpenPreview(
                              import.meta.env.VITE_BACKEND_DOMAIN +
                                question.questionMediaUrl
                            )
                          }
                        />
                      )}
                    </Flex>
                  </Flex>
                  {renderQuestion(question)}
                </Box>
              ))
            : currentQuestions.map((question) => (
                <Box
                  key={question.id}
                  mb={6}
                  border="1px solid"
                  borderColor="gray.200"
                  p={4}
                  borderRadius="md"
                >
                  <Flex
                    justify="center"
                    gap="2"
                    textAlign="center"
                    direction="column"
                  >
                    <Flex justify="center">
                      <Text mb={4} fontSize="lg" fontWeight="bold">
                        {question.questionText}
                      </Text>
                      <Text fontSize="sm" color="red">
                        {question.isRequired ? "*" : ""}
                      </Text>
                    </Flex>
                    <Flex textAlign="center" justify="center">
                      {question.questionMediaUrl && (
                        <Image
                          src={
                            import.meta.env.VITE_BACKEND_DOMAIN +
                            question.questionMediaUrl
                          }
                          alt={`Question ${question.id}`}
                          objectFit="contain"
                          borderRadius="md"
                          maxW="20vw"
                          maxH="27vh"
                          w="auto"
                          h="auto"
                          cursor="pointer"
                          onClick={() =>
                            handleOpenPreview(
                              import.meta.env.VITE_BACKEND_DOMAIN +
                                question.questionMediaUrl
                            )
                          }
                        />
                      )}
                    </Flex>
                  </Flex>
                  {renderQuestion(question)}
                </Box>
              ))}
        </Box>

        <Progress value={progress} colorScheme="blue" />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={4}
        >
          <Button
            onClick={handleBack}
            isDisabled={currentPage === 0}
            colorScheme="gray"
            variant="outline"
          >
            Back
          </Button>
          <Text mb={2} fontWeight="bold" fontSize="md">
            {/* {questionsPerPage === 1 || survey.questions.length <= 4
                ? `Page ${currentPage + 1} of ${totalPages}`
                : `Questions ${startIdx + 1} - ${Math.min(
                    endIdx,
                    survey.questions.length
                  )} of ${survey.questions.length}`} */}
            {`Page ${currentPage + 1} of ${totalPages}`}
          </Text>
          <Button
            onClick={
              timingSession
                ? () => handleTimingSubmit(timingSession.sessionId)
                : handleNext
            }
            colorScheme="blue"
          >
            {currentPage === totalPages - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </>
    );
  }
};

export default SurveyPreviewPage;
