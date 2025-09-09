import {
  VStack,
  Radio,
  Text,
  Input,
  IconButton,
  HStack,
  Button,
  Image,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { FC, useRef, useState } from "react";
import { BiPlus, BiTrash, BiImage } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { Option } from "../../../../types/question.types";
import { uploadMedia } from "../../../../services/media";
import ImagePreviewModal from "../../../common/ImagePreviewModal";

interface Props {
  options: Option[];
  onChange?: (options: Option[]) => void;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  handleMarkDeleteMedia?: (mediaUrl: string) => void;
}

function sortOptions(options: Option[]) {
  return [...options].sort((a, b) => {
    if (a.isOther) return 1;
    if (b.isOther) return -1;
    return 0;
  });
}

const MultipleChoiceInput: FC<Props> = ({
  options,
  onChange,
  isReadOnly,
  isDisabled,
  handleMarkDeleteMedia,
}) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const sortedOptions = sortOptions(options);

  const handleOpenPreview = (url: string) => {
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
    setIsPreviewOpen(false);
  };

  const handleAddOption = () => {
    if (onChange) {
      onChange(
        sortOptions([
          ...options,
          { optionText: `Option ${options.length + 1}` },
        ])
      );
    }
  };

  const handleRemoveOption = (index: number) => {
    if (onChange) {
      const optionToRemove = sortedOptions[index];
      const newOptions = options.filter((opt) => opt !== optionToRemove);
      onChange(sortOptions(newOptions));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    if (onChange) {
      const optionToChange = sortedOptions[index];
      const newOptions = options.map((opt) =>
        opt === optionToChange ? { ...opt, optionText: value } : opt
      );
      onChange(sortOptions(newOptions));
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadMedia(formData);
      if (onChange) {
        const optionToChange = sortedOptions[index];
        const newOptions = options.map((opt) =>
          opt === optionToChange
            ? { ...opt, optionMediaUrl: res.data.mediaUrl }
            : opt
        );
        onChange(sortOptions(newOptions));
      }
    } catch (error) {
      console.error("Upload image failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOther = () => {
    if (onChange) {
      const hasOther = options.some((opt) => opt.isOther);
      if (!hasOther) {
        onChange(
          sortOptions([...options, { optionText: "Other", isOther: true }])
        );
      }
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      if (onChange) {
        const optionToRemoveImageFrom = sortedOptions[index];
        if (handleMarkDeleteMedia && optionToRemoveImageFrom.optionMediaUrl) {
          handleMarkDeleteMedia(optionToRemoveImageFrom.optionMediaUrl);
        }
        const newOptions = options.map((opt) => {
          if (opt === optionToRemoveImageFrom) {
            const { optionMediaUrl, ...rest } = opt;
            return rest;
          }
          return opt;
        });
        onChange(sortOptions(newOptions));
      }
    } catch (error) {
      console.error("Delete image failed", error);
    }
  };

  return (
    <VStack align="start" spacing={3} w="full">
      <Text fontSize="sm" color="gray.500">
        * Choose only one
      </Text>
      <VStack align="start" spacing={2} w="full">
        {sortedOptions.map((option, index) => (
          <VStack key={index} align="start" w="full" spacing={1}>
            <HStack w="full">
              <Radio
                value={option.optionText}
                isDisabled={isReadOnly}
                cursor={isDisabled ? "not-allowed" : "pointer"}
              />
              <Input
                value={option.optionText || ""}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                size="sm"
                isReadOnly={isReadOnly || option.isOther}
                isDisabled={isDisabled || option.isOther}
                placeholder="Option text"
              />
              {!option.optionMediaUrl && !option.isOther && (
                <>
                  <IconButton
                    aria-label="Add image"
                    icon={<BiImage />}
                    size="sm"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    isDisabled={isReadOnly}
                    cursor={isDisabled ? "not-allowed" : "pointer"}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={(el) => {
                      fileInputRefs.current[index] = el;
                    }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(index, e.target.files[0]);
                      }
                    }}
                    disabled={isReadOnly}
                  />
                </>
              )}
              <IconButton
                aria-label="Remove option"
                icon={<BiTrash />}
                size="sm"
                colorScheme="red"
                onClick={() => handleRemoveOption(index)}
                isDisabled={isReadOnly}
                cursor={isDisabled ? "not-allowed" : "pointer"}
              />
            </HStack>
            {option.optionMediaUrl && (
              <HStack spacing={2} mt={2} position="relative">
                {isLoading ? (
                  <Center h="100vh" flexDirection="column" gap={4}>
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
                  <>
                    <Image
                      src={
                        import.meta.env.VITE_BACKEND_DOMAIN +
                        option.optionMediaUrl
                      }
                      alt={`Option ${index + 1}`}
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
                            option.optionMediaUrl!
                        )
                      }
                    />
                    <IconButton
                      aria-label="Close upload"
                      icon={<IoMdClose />}
                      color="red.500"
                      border="1px solid red"
                      bg="white"
                      _hover={{ bg: "red.50" }}
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                      isDisabled={isReadOnly}
                      display={isReadOnly ? "none" : "inline-flex"}
                      cursor={isDisabled ? "not-allowed" : "pointer"}
                      position="absolute"
                      top={-2}
                      right={-2}
                    />
                  </>
                )}
              </HStack>
            )}
          </VStack>
        ))}
      </VStack>
      <HStack spacing={2}>
        <IconButton
          aria-label="Add option"
          icon={<BiPlus />}
          size="sm"
          onClick={handleAddOption}
          isDisabled={isReadOnly}
          cursor={isDisabled ? "not-allowed" : "pointer"}
        />
        <Text>{" | "}</Text>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleAddOther}
          isDisabled={isReadOnly || options.some((opt) => opt.isOther)}
          cursor={isDisabled ? "not-allowed" : "pointer"}
          display={options.some((opt) => opt.isOther) ? "none" : "inline-flex"}
        >
          <Text
            fontStyle="italic"
            textDecoration="underline"
            _hover={{ color: "blue.500" }}
          >
            Add Other Answer
          </Text>
        </Button>
      </HStack>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        imageUrl={previewUrl}
      />
    </VStack>
  );
};

export default MultipleChoiceInput;
