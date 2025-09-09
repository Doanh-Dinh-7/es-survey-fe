import {
  Box,
  Text,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Image,
} from "@chakra-ui/react";
import { ReactNode, useState, useRef, useEffect } from "react";
import { MoreVertical, Lock } from "lucide-react";
import { deleteSurvey } from "../../services/survey";
import imagePlaceholder from "../../../public/ES-logo.png";
interface TemplateCardProps {
  surveyId?: string;
  icon?: ReactNode;
  title: string;
  questionCount: number;
  description: string;
  surveyMediaUrl?: string;
  onUse: () => void;
  isCreateCard?: boolean;
  setModalConfig?: any;
  setTemplateSurveys?: any;
  isDeletable?: boolean;
}

const TemplateCard = ({
  surveyId,
  icon,
  title,
  questionCount,
  description,
  surveyMediaUrl,
  onUse,
  isCreateCard,
  setModalConfig,
  setTemplateSurveys,
  isDeletable,
}: TemplateCardProps) => {
  const toast = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const [initialHeight, setInitialHeight] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (cardRef.current) {
      setInitialHeight(cardRef.current.offsetHeight);
    }
  }, []);

  const isEllipsisActive = (el: HTMLDivElement | null) => {
    if (!el) return false;
    return el.scrollHeight > el.clientHeight;
  };

  const [titleLines, setTitleLines] = useState(1);
  const [descLines, setDescLines] = useState(2);

  useEffect(() => {
    if (!titleRef.current) return;

    const lineHeight = parseFloat(
      getComputedStyle(titleRef.current).lineHeight
    );
    const lines = Math.round(titleRef.current.scrollHeight / lineHeight);

    const maxTotalLines = 3;
    setTitleLines(lines > maxTotalLines ? maxTotalLines : lines);
    setDescLines(Math.max(0, maxTotalLines - lines));
  }, [title, isHovered]);

  const handleDeleteTemplate = (surveyId: string, title: string) => {
    setModalConfig({
      isOpen: true,
      title: "Delete template",
      message: (
        <Text>
          Are you sure you want to delete template{" "}
          <Text as="span" fontWeight="bold">
            {title}
          </Text>{" "}
          ?
        </Text>
      ),
      onConfirm: async () => {
        try {
          const res = await deleteSurvey(surveyId);
          if (res.statusCode === 200) {
            setTemplateSurveys((prev: any) =>
              prev.filter((s: any) => s.id !== surveyId)
            );
            toast({
              title: "Deleted template",
              description: res.message,
              status: "success",
              duration: 3000,
              isClosable: true,
              variant: "solid",
            });
          }
        } catch (error: any) {
          toast({
            title: "Delete template fail",
            description:
              error?.response?.data?.message ||
              error?.message ||
              "Invalid Error",
            status: "error",
            duration: 3000,
            isClosable: true,
            variant: "solid",
          });
        }
        setModalConfig((prev: any) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <Box
      ref={cardRef}
      bg={isCreateCard ? "gray.50" : "white"}
      borderRadius="xl"
      boxShadow="md"
      p={2}
      w="20rem"
      minH="17rem"
      maxH="17rem"
      height={
        isHovered &&
        !isEllipsisActive(titleRef.current) &&
        !isEllipsisActive(descRef.current)
          ? initialHeight
          : "17rem"
      }
      overflow={isHovered ? "visible" : "hidden"}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      gap={3}
      border="2px dashed"
      borderColor={isCreateCard ? "blue.300" : "transparent"}
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "xl",
        borderColor: isCreateCard ? "blue.400" : "blue.500",
        zIndex: 1,
      }}
      transition="all 0.2s"
      cursor="pointer"
      position="relative"
      onClick={onUse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isCreateCard &&
        surveyId &&
        (isDeletable ? (
          setModalConfig && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<MoreVertical size={20} />}
                variant="ghost"
                boxShadow="none"
                position="absolute"
                top={2}
                right={2}
                aria-label="More options"
                onClick={(e) => e.stopPropagation()}
              />
              <MenuList onClick={(e) => e.stopPropagation()}>
                <MenuItem
                  color="red.500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTemplate(surveyId, title);
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          )
        ) : (
          <IconButton
            icon={<Lock size={20} />}
            variant="ghost"
            boxShadow="none"
            position="absolute"
            top={2}
            right={2}
            aria-label="Not deletable"
            isDisabled
            _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
          />
        ))}
      {!isCreateCard && (
        <Box
          as="img"
          src={
            surveyMediaUrl
              ? import.meta.env.VITE_BACKEND_DOMAIN + surveyMediaUrl
              : imagePlaceholder
          }
          alt="Survey Media"
          borderRadius="md"
          objectFit="cover"
          width="100%"
          height="4rem"
          // position="absolute"
        />
      )}
      <Flex align="center" gap={2} mb={1} w="100%">
        {icon}
        <Text
          ref={titleRef}
          fontWeight="bold"
          fontSize="md"
          textAlign="center"
          noOfLines={isHovered ? titleLines : 1}
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {title}
        </Text>
      </Flex>
      {!isCreateCard && (
        <Text color="gray.500" fontSize="sm">
          {questionCount} questions
        </Text>
      )}
      <Text
        ref={descRef}
        color="gray.700"
        fontSize="sm"
        mb={2}
        noOfLines={isHovered ? descLines : 2}
        textAlign="center"
        textOverflow="ellipsis"
        overflow="hidden"
        w="100%"
      >
        {description}
      </Text>
      <Flex w="100%" justify="center" mt="auto">
        <Button colorScheme="blue">
          {isCreateCard ? "Create New" : "Use Template"}
        </Button>
      </Flex>
    </Box>
  );
};

export default TemplateCard;
