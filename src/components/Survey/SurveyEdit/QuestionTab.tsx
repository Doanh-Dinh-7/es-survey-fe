import {
  Heading,
  FormControl,
  Input,
  FormErrorMessage,
  Textarea,
  VStack,
  Box,
  Image,
  Button,
  Spinner,
  Text,
  Center,
  AspectRatio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import AddQuestionButton from "../../common/AddQuestionButton";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
  useSensor,
  DndContext,
} from "@dnd-kit/core";
import { SortableQuestionItem } from "../SurveyDetail/SortableQuestionItem";
import { Question } from "../../../types/question.types";
import React from "react";
import { uploadMedia } from "../../../services/media";
import ImagePreviewModal from "../../common/ImagePreviewModal";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/cropImage";

interface QuestionTabProps {
  currentMode: "create" | "edit" | "view";
  isViewMode: boolean;
  isClosedSurvey: boolean;
  isPublishedSurvey: boolean;
  title: string;
  setTitle: (val: string) => void;
  titleError: string;
  description: string;
  setDescription: (val: string) => void;
  descriptionError: string;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  handleAddQuestion: () => void;
  handleQuestionChange: (order: number, field: string, value: any) => void;
  handleDeleteQuestion: (order: number) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleMarkDeleteMedia: (mediaUrl: string) => void;
  surveyMediaUrl: string;
  setSurveyMediaUrl: (val: string) => void;
}

const QuestionTab: React.FC<QuestionTabProps> = ({
  currentMode,
  isViewMode,
  isClosedSurvey,
  isPublishedSurvey,
  title,
  setTitle,
  titleError,
  description,
  setDescription,
  descriptionError,
  questions,
  handleAddQuestion,
  handleQuestionChange,
  handleDeleteQuestion,
  handleDragEnd,
  handleMarkDeleteMedia,
  surveyMediaUrl,
  setSurveyMediaUrl,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [mediaLoading, setMediaLoading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isCropOpen, setIsCropOpen] = React.useState(false);
  const [imageForCrop, setImageForCrop] = React.useState<string | null>(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleOpenPreview = (url: string) => {
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
    setIsPreviewOpen(false);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageForCrop(reader.result as string);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async () => {
    if (!imageForCrop || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(
      imageForCrop as string,
      croppedAreaPixels,
      0
    );
    const blob = await fetch(croppedImage).then((res) => res.blob());
    const formData = new FormData();
    formData.append("image", blob, "cropped.jpg");
    setMediaLoading(true);
    try {
      const res = await uploadMedia(formData);
      setSurveyMediaUrl(res.data.mediaUrl);
    } finally {
      setMediaLoading(false);
      setIsCropOpen(false);
      setImageForCrop(null);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Heading as="h2" size="lg">
        {currentMode === "create"
          ? "Create New Survey"
          : currentMode === "view"
          ? "View Survey"
          : "Edit Survey"}
      </Heading>
      <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
        <FormControl isInvalid={!title && !isViewMode && !!titleError} mb={2}>
          <Input
            placeholder="Survey title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isReadOnly={isViewMode}
            size="lg"
            fontSize="xl"
            fontWeight="bold"
            borderWidth="2px"
            maxLength={150}
            bg="white"
            _hover={{ borderColor: "blue.400", bg: "gray.50" }}
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
              bg: "gray.50",
            }}
            mb={2}
            cursor={
              isClosedSurvey || isPublishedSurvey ? "not-allowed" : "text"
            }
            isRequired={true}
          />
          {!title && !isViewMode && (
            <FormErrorMessage>{titleError}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          isInvalid={!description && !isViewMode && !!descriptionError}
        >
          <Textarea
            placeholder="Survey description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            resize="vertical"
            isReadOnly={isViewMode}
            size="md"
            minH="100px"
            borderWidth="2px"
            bg="white"
            _hover={{ borderColor: "blue.400", bg: "gray.50" }}
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
              bg: "gray.50",
            }}
            cursor={
              isClosedSurvey || isPublishedSurvey ? "not-allowed" : "text"
            }
            isRequired={true}
          />
          {!description && !isViewMode && (
            <FormErrorMessage>{descriptionError}</FormErrorMessage>
          )}
        </FormControl>
        <Box mt={4} textAlign="left">
          <Text fontWeight="bold" mb={2}>
            Survey Avatar (16:9 Ratio)
          </Text>
          {surveyMediaUrl && (
            <Box position="relative" display="inline-block" width="100%">
              <AspectRatio
                ratio={16 / 9}
                width="100%"
                mb={2}
                borderRadius="md"
                overflow="hidden"
              >
                {mediaLoading ? (
                  <Center bg="whiteAlpha.700" flexDirection="column" gap={4}>
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      size="xl"
                      color="blue.500"
                    />
                    <Text color="blue.500">Loading image...</Text>
                  </Center>
                ) : (
                  <Image
                    src={import.meta.env.VITE_BACKEND_DOMAIN + surveyMediaUrl}
                    alt="Survey Media"
                    objectFit="cover"
                    cursor="pointer"
                    onClick={() =>
                      handleOpenPreview(
                        import.meta.env.VITE_BACKEND_DOMAIN + surveyMediaUrl
                      )
                    }
                  />
                )}
              </AspectRatio>

              {/* Button xoá ảnh nên đặt ngoài AspectRatio */}
              {!isViewMode && !mediaLoading && (
                <Button
                  aria-label="Xoá ảnh"
                  colorScheme="red"
                  size="xs"
                  position="absolute"
                  top={1}
                  right={1}
                  onClick={() => {
                    if (handleMarkDeleteMedia)
                      handleMarkDeleteMedia(surveyMediaUrl);
                    setSurveyMediaUrl("");
                  }}
                  zIndex={2}
                >
                  X
                </Button>
              )}
            </Box>
          )}

          {!isViewMode && !surveyMediaUrl && (
            <>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="survey-media-upload"
                onChange={handleMediaChange}
                disabled={mediaLoading || isClosedSurvey || isPublishedSurvey}
              />
              <label htmlFor="survey-media-upload">
                <Button
                  as="span"
                  colorScheme="blue"
                  isLoading={mediaLoading}
                  loadingText="Uploading..."
                  disabled={mediaLoading || isClosedSurvey || isPublishedSurvey}
                  size="sm"
                >
                  Upload image
                </Button>
              </label>
            </>
          )}
        </Box>
      </Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => String(q?.id || q?.tempId))}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((question) => (
            <SortableQuestionItem
              key={question.id || question.tempId}
              id={question.id || question.tempId}
              question={question}
              onChange={handleQuestionChange}
              onDelete={handleDeleteQuestion}
              isReadOnly={isViewMode}
              isDisabled={isClosedSurvey || isPublishedSurvey}
              handleMarkDeleteMedia={handleMarkDeleteMedia}
            />
          ))}
        </SortableContext>
      </DndContext>
      {!isViewMode && <AddQuestionButton onClick={handleAddQuestion} />}
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        imageUrl={previewUrl}
      />
      {/* Modal cắt ảnh bìa */}
      {isCropOpen && (
        <Modal isOpen={isCropOpen} onClose={() => setIsCropOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Chọn vùng hiển thị ảnh (16:9)</ModalHeader>
            <ModalBody>
              <Box position="relative" width="100%" height="550px">
                <Cropper
                  image={imageForCrop || undefined}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, area) => setCroppedAreaPixels(area)}
                />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleCropComplete}>
                Save selection
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
};

export default QuestionTab;
