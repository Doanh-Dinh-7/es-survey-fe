import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Flex, useToast } from "@chakra-ui/react";
import { paths } from "../../routes/paths";
import { Question, Survey, SurveySettings } from "../../types/question.types";
import HeaderControlButtons from "../../components/common/HeaderControlButtons";
import EditTabs from "../../components/common/EditTabs";
import {
  createSurvey,
  CreateSurveyRequest,
  updateSurvey,
  updateSurveySetting,
  createTemplate,
} from "../../services/survey";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { surveySettingsSchema } from "../../schemas/survey.schema";
import PublishModal from "../../components/common/PublishModal";
import SlackPublishModal from "../../components/common/SlackPublishModal";
import QuestionTab from "../../components/Survey/SurveyEdit/QuestionTab";
import SettingsTab from "../../components/Survey/SurveyEdit/SettingsTab";

interface LocationState {
  mode: "create" | "edit" | "view";
  survey?: Survey;
}

const defaultSettings: SurveySettings = {
  openTime: null,
  closeTime: null,
  maxResponse: null,
  autoCloseCondition: "manual",
  requireEmail: false,
  allowMultipleResponses: false,
  responseLetter: "Thank you for your response!",
};

const STORAGE_KEY = "survey_draft";

const SurveyEditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const hasLoadedDraftRef = useRef(false);
  const { mode, survey } = (location.state as LocationState) || {
    mode: "create",
  };
  const [currentMode, setCurrentMode] = useState<"create" | "edit" | "view">(
    mode
  );

  const [isViewMode, setIsViewMode] = useState(
    mode === "view" ||
      survey?.status === "PUBLISHED" ||
      survey?.status === "CLOSED"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState<string>(survey?.title || "");
  const [description, setDescription] = useState<string>(
    survey?.description || ""
  );
  const [questions, setQuestions] = useState<Question[]>(
    survey?.questions || []
  );
  const [settings, setSettings] = useState<SurveySettings>(
    survey?.settings || defaultSettings
  );
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishSurveyUrl, setPublishSurveyUrl] = useState<string>("");
  const [isSlackPublishModalOpen, setIsSlackPublishModalOpen] = useState(false);
  const [openTimeError, setOpenTimeError] = useState("");
  const [closeTimeError, setCloseTimeError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [deletedOptionMediaUrls, setDeletedOptionMediaUrls] = useState<
    string[]
  >([]);
  const [surveyMediaUrl, setSurveyMediaUrl] = useState<string>(
    survey?.surveyMediaUrl || ""
  );

  const isClosedSurvey = survey?.status === "CLOSED";
  const isPublishedSurvey = survey?.status === "PUBLISHED";

  // Tự động cập nhật autoCloseCondition dựa trên các trường khác
  useEffect(() => {
    if (settings.maxResponse) {
      setSettings((prev) => ({ ...prev, autoCloseCondition: "by_response" }));
    } else if (settings.openTime && settings.closeTime) {
      setSettings((prev) => ({ ...prev, autoCloseCondition: "by_time" }));
    } else {
      setSettings((prev) => ({ ...prev, autoCloseCondition: "manual" }));
    }
  }, [settings.openTime, settings.closeTime, settings.maxResponse]);

  const handleLoading = () => {
    if (hasLoadedDraftRef.current) return;

    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setTitle(draft.title);
      setDescription(draft.description);
      setQuestions(draft.questions);
      setSettings(draft.settings);
      setSurveyMediaUrl(draft.surveyMediaUrl);
    }
    hasLoadedDraftRef.current = true;
  };

  // Load data on mount
  useEffect(() => {
    handleLoading();
  }, []);

  // Save draft to localStorage whenever data changes
  useEffect(() => {
    const draft = {
      title,
      description,
      questions,
      settings,
      currentMode,
      id: survey?.id,
      status: survey?.status,
      surveyMediaUrl,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [
    title,
    description,
    questions,
    settings,
    mode,
    survey?.id,
    survey?.status,
    currentMode,
    surveyMediaUrl,
  ]);

  // Clear draft when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (
        hasLoadedDraftRef.current &&
        (location.pathname === paths.surveyEditor ||
          location.pathname === paths.createSurvey)
      )
        return;
      localStorage.removeItem(STORAGE_KEY);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      localStorage.removeItem(STORAGE_KEY);
    };
  }, [location.pathname]);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      tempId: Math.random().toString(36).substr(2, 9),
      type: "short_text",
      questionText: "",
      isRequired: false,
      order: questions.length + 1,
      options: [],
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleQuestionChange = (order: number, field: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.order === Number(order)
          ? {
              ...q,
              [field]: value,
              ...(field === "type" &&
              (value === "multiple_choice" || value === "checkbox")
                ? {
                    options: [
                      { optionText: "Option 1" },
                      { optionText: "Option 2" },
                    ],
                  }
                : {}),
            }
          : q
      )
    );
  };

  const handleDeleteQuestion = (order: number) => {
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.order !== Number(order));
      // Reorder remaining questions
      return filtered.map((q, index) => ({
        ...q,
        order: index + 1,
      }));
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        // Sử dụng id nếu có, nếu không thì dùng tempId
        const getKey = (item: any) => String(item.id || item.tempId);
        const oldIndex = items.findIndex((item) => getKey(item) === active.id);
        const newIndex = items.findIndex((item) => getKey(item) === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update order for all questions
        return newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
      });
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError("Survey title is required");
      toast({
        title: "Save survey failed",
        description: "Survey title is required",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
      return;
    } else {
      setTitleError("");
    }
    if (!description.trim()) {
      setDescriptionError("Survey description is required");
      toast({
        title: "Save survey failed",
        description: "Survey description is required",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
      return;
    } else {
      setDescriptionError("");
    }

    // Kiểm tra các câu hỏi có bị bỏ trống không
    const emptyQuestion = questions.find((q) => !q.questionText?.trim());
    if (emptyQuestion) {
      toast({
        title: "Save survey failed",
        description: `Question at order ${emptyQuestion.order} is missing text.`,
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
      return;
    }
    setIsLoading(true);
    let validatedSettings;
    try {
      validatedSettings = surveySettingsSchema.parse(settings);
    } catch (error: any) {
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err: any) => {
          toast({
            title: "Invalid settings",
            description: err.message,
            status: "error",
            duration: 4000,
            isClosable: true,
            variant: "solid",
          });
        });
      } else {
        toast({
          title: "Invalid settings",
          description: error.message || "Unknown error",
          status: "error",
          duration: 4000,
          isClosable: true,
          variant: "solid",
        });
      }
      setIsLoading(false);
      return;
    }
    const filteredSettings = Object.fromEntries(
      Object.entries(validatedSettings).filter(([_, value]) => value !== null)
    ) as unknown as SurveySettings;
    if ((openTimeError && !isPublishedSurvey) || closeTimeError) {
      toast({
        title: "Please check open/close time.",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
      setIsLoading(false);
      return;
    }
    // Chuyển đổi openTime và closeTime sang định dạng ISO-8601
    if (filteredSettings.openTime) {
      filteredSettings.openTime = new Date(
        filteredSettings.openTime
      ).toISOString();
    }
    if (filteredSettings.closeTime) {
      filteredSettings.closeTime = new Date(
        filteredSettings.closeTime
      ).toISOString();
    }
    const surveyData: CreateSurveyRequest = {
      title,
      description,
      questions: questions.map((q, index) => ({
        ...q,
        order: index + 1,
      })),
      settings: filteredSettings,
      surveyMediaUrl,
    };

    try {
      if (currentMode === "create") {
        // Xóa bỏ trường id của questions
        surveyData.questions = surveyData.questions.map((q) => ({
          ...q,
          id: undefined,
        }));
        await createSurvey(surveyData, deletedOptionMediaUrls);
        toast({
          title: "Create survey success",
          description: "Create survey success",
          status: "success",
          duration: 3000,
          isClosable: true,
          variant: "solid",
        });
      } else if (currentMode === "edit" && survey?.id) {
        await updateSurvey(
          survey.id,
          { ...surveyData, id: survey.id },
          deletedOptionMediaUrls
        );
        toast({
          title: "Update survey success",
          description: "Update survey success",
          status: "success",
          duration: 3000,
          isClosable: true,
          variant: "solid",
        });
      }

      localStorage.removeItem(STORAGE_KEY); // Clear draft after successful save
      setDeletedOptionMediaUrls([]); // Reset sau khi lưu thành công
      navigate("/");
    } catch (error: any) {
      console.error("Error saving survey:", error);
      toast({
        title: "Save survey failed",
        description:
          error?.response?.data?.errors[0]?.message || "Save survey failed",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClone = async () => {
    try {
      setCurrentMode("create");
      setTitle(`${title} (Clone)`);

      if (survey) {
        survey.id = undefined;
        survey.status = "DRAFT";
      }
      setIsViewMode(false);

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => ({
          ...q,
          surveyId: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          options: q.options?.map((opt) => ({
            ...opt,
            id: undefined,
            questionId: undefined,
            createdAt: undefined,
            updatedAt: undefined,
          })),
        }))
      );

      // Cập nhật settings với id đã xóa
      setSettings((prevSettings) => ({
        ...prevSettings,
        id: undefined,
        surveyId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        openTime: null,
        closeTime: null,
      }));

      toast({
        title: "Clone survey success",
        description: "Clone survey success",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    } catch (error) {
      console.error("Error cloning survey:", error);
      toast({
        title: "Clone survey failed",
        description: "Failed to clone survey",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    }
  };

  const handlePreview = async () => {
    let preSurvey;
    const surveyDraft = localStorage.getItem(STORAGE_KEY);
    if (surveyDraft) {
      preSurvey = JSON.parse(surveyDraft);
    } else {
      return;
    }

    if (preSurvey && !preSurvey.id) {
      const validatedSettings = surveySettingsSchema.parse(settings);
      const filteredSettings = Object.fromEntries(
        Object.entries(validatedSettings).filter(([_, value]) => value !== null)
      ) as unknown as SurveySettings;
      // Chuyển đổi openTime và closeTime sang định dạng ISO-8601
      if (filteredSettings.openTime) {
        filteredSettings.openTime = new Date(
          filteredSettings.openTime
        ).toISOString();
      }
      if (filteredSettings.closeTime) {
        filteredSettings.closeTime = new Date(
          filteredSettings.closeTime
        ).toISOString();
      }
      const surveyData: CreateSurveyRequest = {
        title,
        description,
        questions: questions.map((q, index) => ({
          ...q,
          order: index + 1,
        })),
        settings: filteredSettings,
        surveyMediaUrl,
      };

      const res = await createSurvey(surveyData);
      preSurvey = res.data;
    }

    navigate(paths.surveyPreview, {
      state: {
        survey: preSurvey,
        isPreview: true,
      },
    });
  };

  const handlePublish = async () => {
    if (!survey?.id) return;
    console.log("survey status: ", survey.status);
    setIsSlackPublishModalOpen(true);
  };

  const validateTimes = (open: string | null, close: string | null) => {
    let openErr = "";
    let closeErr = "";
    const now = new Date();
    if (open) {
      const openDate = new Date(open);
      if (openDate < now) {
        openErr = "Open time must be greater than or equal to current.";
      }
      if (close) {
        const closeDate = new Date(close);
        if (closeDate <= openDate) {
          closeErr = "Close time must be greater than open time.";
        }
      }
    }
    setOpenTimeError(openErr);
    setCloseTimeError(closeErr);
  };

  useEffect(() => {
    validateTimes(settings.openTime, settings.closeTime);
  }, [settings.openTime, settings.closeTime]);

  const handleSaveSettings = async () => {
    if (!survey?.id) return;
    if ((openTimeError && !isPublishedSurvey) || closeTimeError) {
      toast({
        title: "Please check open/close time.",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
      return;
    }
    try {
      // Chuẩn hóa dữ liệu gửi đi
      const reqSettings: any = { ...settings };
      if (isPublishedSurvey) {
        delete reqSettings.openTime;
        // Nếu maxResponse là null hoặc không thay đổi thì loại khỏi request body
        if (
          reqSettings.maxResponse === null ||
          reqSettings.maxResponse === survey.settings?.maxResponse
        ) {
          delete reqSettings.maxResponse;
        }
        // Nếu closeTime không thay đổi thì loại khỏi request body
        if (
          (!reqSettings.closeTime && !survey.settings?.closeTime) ||
          (reqSettings.closeTime &&
            survey.settings?.closeTime &&
            new Date(reqSettings.closeTime).toISOString() ===
              new Date(survey.settings.closeTime).toISOString())
        ) {
          delete reqSettings.closeTime;
        } else if (reqSettings.closeTime) {
          reqSettings.closeTime = new Date(reqSettings.closeTime).toISOString();
        }
      } else {
        if (reqSettings.maxResponse === null) {
          delete reqSettings.maxResponse;
        }
        if (reqSettings.openTime) {
          reqSettings.openTime = new Date(reqSettings.openTime).toISOString();
        }
        if (reqSettings.closeTime) {
          reqSettings.closeTime = new Date(reqSettings.closeTime).toISOString();
        }
      }
      await updateSurveySetting(reqSettings, survey.id);
      toast({
        title: "Update settings success",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    } catch (error) {
      toast({
        title: "Update settings failed",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "solid",
      });
    }
  };

  const handleSaveAsTemplate = async () => {
    try {
      // Xóa Opentime và Closetime
      settings.openTime = settings.closeTime = null;
      const validatedSettings = surveySettingsSchema.parse(settings);
      const filteredSettings = Object.fromEntries(
        Object.entries(validatedSettings).filter(([_, value]) => value !== null)
      ) as unknown as SurveySettings;

      const surveyData: CreateSurveyRequest = {
        title: `${title} (Template)`,
        description,
        questions: questions.map((q, index) => ({
          ...q,
          order: index + 1,
        })),
        settings: filteredSettings,
        surveyMediaUrl,
        isTemplate: true,
      };

      await createTemplate(surveyData);
      toast({
        title: "Save as template success",
        description: "Survey has been saved as a template",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Save as template failed",
        description: "Failed to save survey as template",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMarkDeleteMedia = (mediaUrl: string) => {
    setDeletedOptionMediaUrls((prev) =>
      mediaUrl && !prev.includes(mediaUrl) ? [...prev, mediaUrl] : prev
    );
  };

  const handleSlackSuccess = async () => {
    // Sau khi gửi thông báo Slack thành công, gọi API publish survey với channels/message
    if (!survey?.id) return;
    try {
      // Luôn set link và mở modal, không chỉ khi status là "PENDING"
      const url = `${import.meta.env.VITE_WEB_DOMAIN}${paths.surveyPreview}/${
        survey?.id
      }`;
      setPublishSurveyUrl(url);
      setIsPublishModalOpen(true);

      // Nếu lần đầu publish thì cập nhật status
      if (survey.status === "PENDING") {
        toast({
          title: "Success",
          description: "Survey published successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
          variant: "solid",
        });
        survey.status = "PUBLISHED";
        setCurrentMode("view");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish survey",
        status: "error",
        duration: 2000,
        isClosable: true,
        variant: "solid",
      });
    }
  };

  const questionTab = (
    <QuestionTab
      currentMode={currentMode}
      isViewMode={isViewMode}
      isClosedSurvey={isClosedSurvey}
      isPublishedSurvey={isPublishedSurvey}
      title={title}
      setTitle={setTitle}
      titleError={titleError}
      description={description}
      setDescription={setDescription}
      descriptionError={descriptionError}
      questions={questions}
      setQuestions={setQuestions}
      handleAddQuestion={handleAddQuestion}
      handleQuestionChange={handleQuestionChange}
      handleDeleteQuestion={handleDeleteQuestion}
      handleDragEnd={handleDragEnd}
      handleMarkDeleteMedia={handleMarkDeleteMedia}
      surveyMediaUrl={surveyMediaUrl}
      setSurveyMediaUrl={setSurveyMediaUrl}
    />
  );

  const settingsTab = (
    <SettingsTab
      settings={settings}
      setSettings={setSettings}
      isClosedSurvey={isClosedSurvey}
      isPublishedSurvey={isPublishedSurvey}
      isViewMode={isViewMode}
      openTimeError={openTimeError}
      closeTimeError={closeTimeError}
      handleSaveSettings={handleSaveSettings}
    />
  );

  return (
    <Flex direction="column" align="center" w="100%" mt={10}>
      <Flex w="100%" justify="flex-end">
        <HeaderControlButtons
          onSave={handleSave}
          onPreview={handlePreview}
          onPublish={handlePublish}
          onClone={handleClone}
          onSaveAsTemplate={handleSaveAsTemplate}
          surveyId={survey?.id || undefined}
          isPublishedSurvey={isPublishedSurvey}
          isClosedSurvey={isClosedSurvey}
          isViewMode={isViewMode || currentMode === "view"}
        />
      </Flex>
      <Container maxW="3xl" py={6} alignContent={"center"}>
        <EditTabs questionTab={questionTab} settingsTab={settingsTab} />
      </Container>
      {isSlackPublishModalOpen && (
        <SlackPublishModal
          isOpen={isSlackPublishModalOpen}
          onClose={() => setIsSlackPublishModalOpen(false)}
          surveyId={survey?.id || ""}
          onSuccess={handleSlackSuccess}
          isPublishedSurvey={isPublishedSurvey}
          isClosedSurvey={isClosedSurvey}
        />
      )}
      {publishSurveyUrl && (
        <PublishModal
          status={survey?.status || ""}
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          surveyUrl={publishSurveyUrl}
        />
      )}
    </Flex>
  );
};

export default SurveyEditorPage;
