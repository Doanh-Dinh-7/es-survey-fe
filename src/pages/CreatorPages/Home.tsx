import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  SimpleGrid,
  Center,
  useToast,
  Select,
  HStack,
  ScaleFade,
  Spinner,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SurveyCard from "../../components/Survey/SurveyCard";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm";
import {
  getAllSurveys,
  getSurvey,
  deleteSurvey,
  statisticsSurvey,
  getTemplateSurveys,
  cloneSurvey,
} from "../../services/survey";
import SearchInput from "../../components/common/SearchInput";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FilterIcon,
  PlusIcon,
} from "lucide-react";
import TemplateCard from "../../components/Survey/TemplateCard";
import ReusableCarousel from "../../components/common/ReusableCarousel";

interface Survey {
  id: string;
  title: string;
  description: string;
  surveyMediaUrl?: string;
  createdAt: string;
  currentResponse: number;
  totalResponse: number;
  timeLeft: string;
  timeEnd: string;
  status: string;
  userId?: string;
  _count?: {
    responses: number | null;
    questions?: number;
  };
  settings: {
    maxResponse: number | null;
  };
  questions?: any[];
}

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const MotionBox = motion(Box);

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "spring",
  damping: 25,
  stiffness: 120,
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pageSize: 9,
    totalPages: 1,
  });
  const isFirstRender = useRef(true);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [templateSurveys, setTemplateSurveys] = useState<Survey[]>([]);
  const fetchSurveys = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const res = await getAllSurveys(page);
      setSurveys(res.data.surveys);
      setPagination(res.data.pagination);
    } catch (error) {
      toast({
        title: "Error fetching surveys",
        description: "Failed to fetch surveys",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    }
    isFirstRender.current = false;
    setIsLoading(false);
  };

  const fetchTemplateSurveys = async () => {
    setIsLoading(true);
    try {
      const res = await getTemplateSurveys();
      const templates = res.data.surveys.map((survey: any) => ({
        ...survey,
        surveyMediaUrl: survey.surveyMediaUrl,
        _count: survey._count || { responses: 0 },
        currentResponse: survey.currentResponse || 0,
        totalResponse: survey.totalResponse || 0,
        settings: survey.settings || {},
      }));
      setTemplateSurveys(templates);
    } catch (error) {
      toast({
        title: "Error fetching templates",
        description: "Failed to fetch template surveys",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSurveys();
    fetchTemplateSurveys();
  }, []);

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchSurveys(newPage);
  };

  const handleCreate = () => {
    navigate("/create-survey", { state: { mode: "create" } });
  };

  const handleDelete = (survey: Survey) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Survey",
      message: (
        <Text fontSize="sm">
          {survey.status === "PUBLISHED" ? (
            <Text fontWeight="bold" fontSize="large">
              THIS SURVEY IS NOW{" "}
              <Text color="green" as="span">
                PUBLISHED
              </Text>
              .
            </Text>
          ) : null}{" "}
          Are you sure you want to delete{" "}
          <Text as="span" fontWeight="bold">
            {survey.title}
          </Text>
        </Text>
      ),
      onConfirm: async () => {
        try {
          const res = await deleteSurvey(survey.id);
          if (res.statusCode === 200) {
            setSurveys(surveys.filter((s) => s.id !== survey.id));
            toast({
              title: "Survey deleted",
              description: res.message,
              status: "success",
              duration: 3000,
              isClosable: true,
              variant: "solid",
            });
          }
        } catch (error: any) {
          toast({
            title: "Survey deleted failed",
            description: error?.response?.data?.message || "Unknown error",
            status: "error",
            duration: 3000,
            isClosable: true,
            variant: "solid",
          });
        }
        setModalConfig({ ...modalConfig, isOpen: false });
      },
    });
  };

  const handleViewResult = async (survey: Survey) => {
    try {
      const res = await statisticsSurvey(survey.id);
      toast({
        title: "Get statistic survey success",
        description: "Get statistic survey success",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
      navigate(`/survey-result/${survey.id}`, {
        state: {
          surveyStatistics: res.data,
        },
      });
    } catch (error) {
      console.error("Error getting statistic survey:", error);
    }
  };

  const handleViewSurvey = async (survey: Survey) => {
    try {
      const res = await getSurvey(survey.id);
      toast({
        title: "Get survey success",
        description: res?.message || "Get survey success",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
      navigate("/survey-editor", {
        state: {
          mode: "view",
          survey: res.data.survey,
        },
      });
    } catch (error) {
      console.error("Error viewing survey:", error);
      toast({
        title: "Get survey failed",
        description: "Failed to get survey details",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    }
  };

  const handleEditSurvey = async (survey: Survey) => {
    try {
      const res = await getSurvey(survey.id);
      toast({
        title: "Get survey success",
        description: res?.message || "Get survey success",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
      navigate("/survey-editor", {
        state: {
          mode: "edit",
          survey: res.data.survey,
        },
      });
    } catch (error) {
      console.error("Error editing survey:", error);
      toast({
        title: "Get survey failed",
        description: "Get survey failed",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    }
  };

  const handleCloneAndEditSurvey = async (survey: Survey) => {
    try {
      // 1. Clone survey
      const cloneRes = await cloneSurvey(survey.id);

      if (cloneRes.success) {
        // 2. Lấy thông tin đầy đủ của survey mới
        const surveyRes = await getSurvey(cloneRes.data.id);

        toast({
          title: "Copy created successfully",
          description: "You are editing a new survey from a template.",
          status: "success",
          duration: 3000,
          isClosable: true,
          variant: "solid",
        });

        // 3. Chuyển hướng với đầy đủ thông tin
        navigate("/survey-editor", {
          state: {
            mode: "edit",
            survey: surveyRes.data.survey, // Dùng survey đầy đủ từ getSurvey
          },
        });
      }
    } catch (error) {
      toast({
        title: "Clone failed",
        description: "Unable to clone survey template",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleFilter = (status: string | null) => {
    setStatusFilter(status);
  };

  const filteredSurveys = surveys.filter((survey) => {
    const matchTitle = survey.title.toLowerCase().includes(searchTerm);
    const matchStatus = statusFilter ? survey.status === statusFilter : true;
    return matchTitle && matchStatus;
  });

  const systemTemplates = templateSurveys.filter((s) => !s.userId);
  const personalTemplates = templateSurveys.filter((s) => s.userId);

  if (isLoading && isFirstRender.current) {
    return (
      <Center h="100vh" flexDirection="column" gap={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          size="xl"
          color="blue.500"
        />
        <Text color="blue.500">Loading surveys...</Text>
      </Center>
    );
  }

  return (
    <MotionBox
      p={6}
      mt={10}
      w="100%"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition as any}
    >
      <Flex justify="space-between" flexDirection="column" gap={5}>
        <Flex flexDirection="column" gap={2} alignItems="flex-start" mb={5}>
          <Text fontSize="4xl" fontWeight="bold">
            Survey Home
          </Text>
          <Text fontSize="sm" fontStyle="italic">
            Manage your surveys and get insights from your audience
          </Text>
        </Flex>
        <Text fontSize="xl" fontWeight="bold" mb={2} textAlign="left">
          Template Surveys
        </Text>
        <Flex direction="column" align="center" gap={6} mb={4}>
          <Flex
            align="center"
            gap={4}
            mb={4}
            w="full"
            position="relative"
            zIndex={2}
          >
            <Flex align="center" w="30%">
              <TemplateCard
                key="create-new"
                icon={<PlusIcon color="#3182ce" size={48} />}
                title="Create New Survey"
                description="Start from scratch with a blank survey"
                questionCount={0}
                onUse={handleCreate}
                isCreateCard
              />
            </Flex>
            <Flex align="center" w="70%">
              {/* template không có userId */}
              <ReusableCarousel
                items={systemTemplates}
                itemWidth="320px"
                renderItem={(survey) => (
                  <Box
                    minW="18rem"
                    maxW="20rem"
                    position="relative"
                    overflow="visible"
                  >
                    <TemplateCard
                      surveyId={survey.id}
                      title={survey.title}
                      questionCount={survey._count?.questions || 0}
                      description={survey.description}
                      surveyMediaUrl={survey.surveyMediaUrl}
                      onUse={() => handleCloneAndEditSurvey(survey)}
                      setModalConfig={setModalConfig}
                      setTemplateSurveys={setTemplateSurveys}
                      isDeletable={false}
                    />
                  </Box>
                )}
              />
            </Flex>
          </Flex>
          {/* template có userId  */}
          {personalTemplates.length > 0 && (
            <Flex position="relative" zIndex={1} w="full">
              <ReusableCarousel
                items={personalTemplates}
                itemWidth="320px"
                renderItem={(survey) => (
                  <Box
                    minW="18rem"
                    maxW="20rem"
                    position="relative"
                    overflow="visible"
                  >
                    <TemplateCard
                      surveyId={survey.id}
                      title={survey.title}
                      questionCount={survey._count?.questions || 0}
                      description={survey.description}
                      surveyMediaUrl={survey.surveyMediaUrl}
                      onUse={() => handleCloneAndEditSurvey(survey)}
                      setModalConfig={setModalConfig}
                      setTemplateSurveys={setTemplateSurveys}
                      isDeletable={true}
                    />
                  </Box>
                )}
              />
            </Flex>
          )}
        </Flex>
        <Text fontSize="xl" fontWeight="bold" mb={2} textAlign="left">
          My Surveys
        </Text>
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          gap={2}
          mb={10}
        >
          <Flex flexDirection="row" gap={2}>
            <SearchInput
              placeholder="Search survey"
              handleSearch={handleSearch}
            />
            <Select
              placeholder="Filter"
              variant="outline"
              size="md"
              borderColor={
                !statusFilter
                  ? "blue.500"
                  : statusFilter === "PENDING"
                  ? "yellow.500"
                  : statusFilter === "CLOSED"
                  ? "red.500"
                  : "green.500"
              }
              height="40px"
              width="180px"
              textColor={
                !statusFilter
                  ? "blue.500"
                  : statusFilter === "PENDING"
                  ? "yellow.500"
                  : statusFilter === "CLOSED"
                  ? "red.500"
                  : "green.500"
              }
              value={statusFilter || ""}
              onChange={(e) => handleFilter(e.target.value || null)}
              icon={
                <FilterIcon
                  size={18}
                  color={
                    !statusFilter
                      ? "#359EFF"
                      : statusFilter === "PENDING"
                      ? "#ECC94B"
                      : statusFilter === "CLOSED"
                      ? "#E53E3E"
                      : "#48BB78"
                  }
                />
              }
            >
              <option value="PENDING" style={{ color: "#ECC94B" }}>
                PENDING
              </option>
              <option value="PUBLISHED" style={{ color: "#48BB78" }}>
                PUBLISHED
              </option>
              <option value="CLOSED" style={{ color: "#E53E3E" }}>
                CLOSED
              </option>
            </Select>
          </Flex>
        </Flex>
      </Flex>

      {surveys.length === 0 ? (
        <Center h="100vh">
          <Text>No surveys found</Text>
        </Center>
      ) : (
        <>
          <ScaleFade in={true} transition={{ enter: { duration: 0.9 } }}>
            <SimpleGrid
              minChildWidth="350px"
              spacing={6}
              marginTop={8}
              justifyItems="center"
            >
              {filteredSurveys.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  {...survey}
                  _count={survey._count || { responses: 0 }}
                  onViewResult={() => handleViewResult(survey)}
                  onDelete={() => handleDelete(survey)}
                  onEdit={() => handleEditSurvey(survey)}
                  onView={() => handleViewSurvey(survey)}
                  status={survey.status}
                />
              ))}
            </SimpleGrid>
          </ScaleFade>
          {pagination.totalPages > 1 && (
            <Flex justify="center" mt={8}>
              <HStack spacing={2}>
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  isDisabled={pagination.page === 1}
                  colorScheme="blue"
                  variant="outline"
                  leftIcon={<ArrowLeftIcon />}
                >
                  Previous
                </Button>
                <Text>
                  Page {pagination.page} of {pagination.totalPages}
                </Text>
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  isDisabled={pagination.page === pagination.totalPages}
                  colorScheme="blue"
                  variant="outline"
                  rightIcon={<ArrowRightIcon />}
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          )}
        </>
      )}
      <ModalConfirm
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </MotionBox>
  );
};

export default Home;
