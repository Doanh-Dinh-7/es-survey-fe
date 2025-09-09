import {
  Box,
  Input,
  Select,
  IconButton,
  Flex,
  Text,
  Spacer,
  FormControl,
  FormErrorMessage,
  Image,
  Center,
  Spinner,
} from "@chakra-ui/react";

import { ChangeEvent, FC, useRef, useState } from "react";
import LongTextInput from "./input-types/LongTextInput";
import ShortTextInput from "./input-types/ShortTextInput";
import MultipleChoiceInput from "./input-types/MultipleChoiceInput";
import CheckboxInput from "./input-types/CheckboxInput";
import RequiredToggle from "../../common/RequiredToggle";
import { BiTrash, BiText, BiCheckSquare, BiImage } from "react-icons/bi";
import { FaRegDotCircle } from "react-icons/fa";
import { QuestionType, Option } from "../../../types/question.types";
import { uploadMedia } from "../../../services/media";
import { IoMdClose } from "react-icons/io";
import ImagePreviewModal from "../../common/ImagePreviewModal";

interface QuestionItemProps {
  order: number;
  questionText: string;
  questionMediaUrl?: string;
  type: QuestionType;
  isRequired: boolean;
  options: Option[];
  onChange: (order: number, field: string, value: any) => void;
  onDelete: (order: number) => void;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  handleMarkDeleteMedia?: (mediaUrl: string) => void;
}

const typeMeta = {
  long_text: {
    icon: <BiText color="#F4B400" />,
    label: "Long Text Question",
    subLabel: "Long answer",
  },
  short_text: {
    icon: <BiText color="#4285F4" />,
    label: "Short Text Question",
    subLabel: "Short answer",
  },
  multiple_choice: {
    icon: <FaRegDotCircle color="#0F9D58" />,
    label: "Multiple Choice",
    subLabel: "Single select",
  },
  checkbox: {
    icon: <BiCheckSquare color="#F4B400" />,
    label: "Checkbox",
    subLabel: "Multi select",
  },
};

const QuestionItem: FC<QuestionItemProps> = ({
  order,
  questionText,
  type,
  isRequired,
  options,
  onChange,
  onDelete,
  isReadOnly = false,
  isDisabled = false,
  handleMarkDeleteMedia,
  questionMediaUrl,
}) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenPreview = (url: string) => {
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
    setIsPreviewOpen(false);
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType;
    onChange(order, "type", newType);
    if (newType === "multiple_choice" || newType === "checkbox") {
      onChange(order, "options", [
        { optionText: "Option 1" },
        { optionText: "Option 2" },
      ]);
    }
  };

  const handleMediaChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setMediaLoading(true);
    try {
      const res = await uploadMedia(formData);
      onChange(order, "questionMediaUrl", res.data.mediaUrl);
    } catch (err) {
      // Có thể show toast ở đây nếu muốn
    } finally {
      setMediaLoading(false);
    }
  };

  // Card UI for all types
  return (
    <Box
      bg="white"
      borderRadius="xl"
      p={6}
      mb={6}
      boxShadow="xl"
      borderWidth="2px"
      borderColor="transparent"
      transition="box-shadow 0.2s, border-color 0.2s"
      _hover={{
        borderColor: "purple.400",
        boxShadow: "0 0 0 4px rgba(135, 95, 214, 0.08)", // subtle purple glow
        cursor: "pointer",
      }}
      _active={{
        borderColor: "purple.600",
        boxShadow: "0 0 0 4px rgba(135, 95, 214, 0.16)",
      }}
      role="group"
    >
      {/* Header */}
      <Flex align="center" mb={3}>
        <Flex align="center" gap={2}>
          {typeMeta[type].icon}
          <Text fontWeight="bold">{typeMeta[type].label}</Text>
          <Text color="gray.500" fontWeight="bold" fontSize="sm">
            {typeMeta[type].subLabel}
          </Text>
        </Flex>
        <Spacer />
        {!isReadOnly && !questionMediaUrl && (
          <>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={(el) => {
                fileInputRefs.current[order] = el;
              }}
              onChange={handleMediaChange}
              disabled={mediaLoading || isDisabled}
            />
            <IconButton
              icon={<BiImage />}
              aria-label="Upload question media"
              colorScheme="purple"
              isLoading={mediaLoading}
              disabled={mediaLoading || isDisabled}
              size="sm"
              onClick={() => fileInputRefs.current[order]?.click()}
              cursor={isDisabled ? "not-allowed" : "pointer"}
              _hover={{ bg: "purple.500", color: "white" }}
              mr={2}
            />
          </>
        )}
        <Select
          value={type}
          onChange={handleTypeChange}
          size="sm"
          width="180px"
          borderRadius="md"
          isReadOnly={isReadOnly}
          isDisabled={isDisabled}
          cursor={isDisabled ? "not-allowed" : "pointer"}
          borderColor="gray.300"
          _hover={{ borderColor: "blue.500" }}
          mr={2}
        >
          <option value="long_text">Long Text</option>
          <option value="short_text">Short Text</option>
          <option value="multiple_choice">Multiple Choice</option>
          <option value="checkbox">Checkbox</option>
        </Select>
        <RequiredToggle
          isRequired={isRequired}
          onToggle={(value) => onChange(order, "isRequired", value)}
          isReadOnly={isReadOnly}
        />
      </Flex>
      {/* Question input */}
      <FormControl isInvalid={!questionText && !isReadOnly}>
        <Box
          bg="gray.50"
          borderRadius="md"
          borderColor={!questionText && !isReadOnly ? "red.500" : "gray.300"}
          p={3}
          mb={3}
        >
          <Input
            variant="unstyled"
            placeholder="Type your question here..."
            value={questionText}
            onChange={(e) => onChange(order, "questionText", e.target.value)}
            fontWeight="semibold"
            fontSize="lg"
            cursor={isDisabled ? "not-allowed" : "text"}
            isRequired={true}
          />
        </Box>
        {!questionText && !isReadOnly && (
          <FormErrorMessage>Question text is required</FormErrorMessage>
        )}
      </FormControl>
      {/* Question media view */}
      <Box mb={3}>
        {questionMediaUrl && (
          <Box position="relative" display="inline-block">
            {mediaLoading ? (
              <Center h="100vh" flexDirection="column" gap={4}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  size="xl"
                  color="blue.500"
                  zIndex={1}
                />
                <Text color="blue.500">Loading image...</Text>
              </Center>
            ) : (
              <Image
                src={import.meta.env.VITE_BACKEND_DOMAIN + questionMediaUrl}
                alt="Question Media"
                maxH="180px"
                mb={2}
                borderRadius="md"
                cursor="pointer"
                onClick={() =>
                  handleOpenPreview(
                    import.meta.env.VITE_BACKEND_DOMAIN + questionMediaUrl
                  )
                }
              />
            )}
            {!isReadOnly && (
              <IconButton
                aria-label="Close upload"
                icon={<IoMdClose />}
                color="red.500"
                border="1px solid red"
                bg="white"
                _hover={{ bg: "red.50" }}
                size="sm"
                onClick={() => {
                  if (handleMarkDeleteMedia)
                    handleMarkDeleteMedia(questionMediaUrl);
                  onChange(order, "questionMediaUrl", "");
                }}
                isDisabled={isReadOnly}
                cursor={isDisabled ? "not-allowed" : "pointer"}
                position="absolute"
                top={-2}
                right={-2}
              />
            )}
          </Box>
        )}
      </Box>
      {/* Answer input */}
      <Box bg="gray.50" borderRadius="md" p={3}>
        {type === "long_text" && <LongTextInput />}
        {type === "short_text" && <ShortTextInput />}
        {type === "multiple_choice" && (
          <MultipleChoiceInput
            options={options}
            onChange={(newOptions) => onChange(order, "options", newOptions)}
            isReadOnly={isReadOnly}
            isDisabled={isDisabled}
            handleMarkDeleteMedia={handleMarkDeleteMedia}
          />
        )}
        {type === "checkbox" && (
          <CheckboxInput
            options={options}
            onChange={(newOptions) => onChange(order, "options", newOptions)}
            isReadOnly={isReadOnly}
            isDisabled={isDisabled}
            handleMarkDeleteMedia={handleMarkDeleteMedia}
          />
        )}
      </Box>
      {/* Delete button */}
      <Flex justify="flex-end" mt={2}>
        {!isReadOnly && (
          <IconButton
            aria-label="Delete question"
            icon={<BiTrash />}
            size="md"
            color="red.500"
            colorScheme="gray"
            onClick={() => onDelete(order)}
            opacity={0}
            _groupHover={{ opacity: 1 }}
            transition="opacity 0.2s"
          />
        )}
      </Flex>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        imageUrl={previewUrl}
      />
    </Box>
  );
};

export default QuestionItem;
