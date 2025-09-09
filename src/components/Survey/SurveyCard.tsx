import { Box, Text, Stack, Button, Flex, Icon } from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import { FaRegChartBar, FaTrash } from "react-icons/fa";
import imagePlaceholder from "../../../public/ES-logo.png";

interface SurveyCardProps {
  id: string;
  title: string;
  description: string;
  surveyMediaUrl?: string;
  createdAt: string;
  currentResponse: number;
  _count: {
    responses: number | null;
  };
  settings: {
    maxResponse: number | null;
  };
  timeLeft: string;
  timeEnd: string;
  status: string;
  onViewResult: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onView: () => void;
}

const statusColor = {
  PENDING: "yellow.400",
  PUBLISHED: "green.400",
  CLOSED: "red.400",
};

const SurveyCard: React.FC<SurveyCardProps> = ({
  title,
  surveyMediaUrl,
  createdAt,
  _count,
  settings,
  onViewResult,
  onDelete,
  onEdit,
  onView,
  status,
}) => (
  <Box
    bg="white"
    borderRadius="md"
    boxShadow="md"
    p="4"
    w="350px"
    _hover={{
      transform: "translateY(-2px)",
      boxShadow: "lg",
      borderColor:"blue.400" ,

    }}
    onClick={status === "PENDING" ? onEdit : onView}
    cursor="pointer"
    position="relative"
  >
    {/* Media Preview */}
    <Box
      as="img"
      src={
        surveyMediaUrl
          ? import.meta.env.VITE_BACKEND_DOMAIN + surveyMediaUrl
          : imagePlaceholder
      }
      alt="Survey Media"
      borderRadius="md"
      mb="3"
      objectFit="cover"
      width="100%"
      height="150px"
    />
    {/* Header */}
    <Flex justify="space-between" align="center" mb="3" gap={2}>
      <Text
        fontWeight="bold"
        fontSize="md"
        textAlign="left"
        flexBasis="70%"
        noOfLines={1}
        textOverflow="ellipsis"
        overflow="hidden"
        maxHeight={20}
      >
        {title}
      </Text>
      <Flex align="center" flexBasis="30%" gap="1">
        <Box
          as="span"
          w="2"
          h="2"
          mb={1}
          borderRadius="full"
          bg={statusColor[status as keyof typeof statusColor]}
        />
        <Text
          fontSize="sm"
          fontWeight="medium"
          color={statusColor[status as keyof typeof statusColor]}
          textTransform="capitalize"
        >
          {status.toLocaleUpperCase()}
        </Text>
      </Flex>
    </Flex>

    {/* CreatedAt */}
    <Text fontSize="xs" color="gray.400" mb="2">
      Created: {new Date(createdAt).toLocaleDateString()}
    </Text>

    {/* Response */}
    <Flex align="center" gap="2" mb="4">
      <Icon as={FiUser} color="blue.500" boxSize="5" />
      <Text fontSize="xl" fontWeight="bold">
        {_count.responses || 0}
      </Text>
      <Text fontSize="sm" color="gray.500">
        / {settings.maxResponse || "Unlimited"} responses
      </Text>
    </Flex>

    {/* Buttons */}
    <Stack direction="row" spacing="3" mt="4">
      <Button
        leftIcon={<FaRegChartBar />}
        colorScheme="blue"
        size="sm"
        flex="1"
        onClick={(e) => {
          e.stopPropagation();
          onViewResult();
        }}
      >
        View Result
      </Button>
      <Button
        leftIcon={<FaTrash />}
        colorScheme="red"
        variant="outline"
        size="sm"
        flex="1"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        Delete
      </Button>
    </Stack>
  </Box>
);

export default SurveyCard;
