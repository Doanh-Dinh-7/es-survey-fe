import {
  Box,
  Text,
  VStack,
  HStack,
  Tag,
  Icon,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { BiText, BiCheckSquare, BiGrid } from "react-icons/bi";
import { FaRegDotCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

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

interface ResponseCardProps {
  response: ResponseDetail;
  questions: Question[];
  onDelete?: (responseId: string) => void;
}

const questionTypeIcons = {
  long_text: { icon: BiText, color: "#F4B400" },
  short_text: { icon: BiText, color: "#4285F4" },
  multiple_choice: { icon: FaRegDotCircle, color: "#0F9D58" },
  checkbox: { icon: BiCheckSquare, color: "#F4B400" },
  matrix_choice: { icon: BiGrid, color: "#9C27B0" },
  matrix_input: { icon: BiGrid, color: "#FF9800" },
};

const ResponseCard = ({ response, questions, onDelete }: ResponseCardProps) => {
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  const renderAnswer = (question: Question, answer: any) => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <HStack spacing={2} flexWrap="wrap" textAlign="left">
            <Tag
              size="md"
              variant="subtle"
              colorScheme="teal"
              borderRadius="full"
              py={1}
              px={3}
            >
              <Text textAlign="center" fontSize="sm" color="gray.700">
                {answer?.answer}
              </Text>
            </Tag>
          </HStack>
        );
      case "checkbox":
        return (
          <HStack spacing={2} flexWrap="wrap">
            {(answer?.answer as string[]).map((opt: string, index: number) => (
              <Tag
                key={index}
                size="md"
                variant="subtle"
                colorScheme="teal"
                borderRadius="full"
                py={1}
                px={3}
              >
                {opt}
              </Tag>
            ))}
          </HStack>
        );
      case "short_text":
      case "long_text":
        return (
          <Box bg="gray.200" p={3} borderRadius="md" shadow="md">
            <Text textAlign="justify" fontSize="sm" color="gray.700">
              {answer?.answer}
            </Text>
          </Box>
        );
      case "matrix_choice":
        return (
          <Box overflowX="auto">
            <Table size="sm" variant="simple">
              <Thead bg="blue.50">
                <Tr>
                  <Th>Question</Th>
                  <Th>Selected Answer</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(answer?.answer as any[])?.map((cell: any, index: number) => (
                  <Tr key={index}>
                    <Td fontWeight="medium">{cell.row}</Td>
                    <Td>
                      <Tag colorScheme="blue" size="md">
                        {cell.column}
                      </Tag>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        );
      case "matrix_input":
        return (
          <Box overflowX="auto">
            <Table size="sm" variant="simple">
              <Thead bg="green.50">
                <Tr>
                  <Th>Question</Th>
                  <Th>Column</Th>
                  <Th>Answer</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(answer?.answer as any[])?.map((cell: any, index: number) => (
                  <Tr key={index}>
                    <Td fontWeight="medium">{cell.row}</Td>
                    <Td>
                      <Tag colorScheme="green" size="sm">
                        {cell.column}
                      </Tag>
                    </Td>
                    <Td>
                      <Box bg="gray.100" p={2} borderRadius="md">
                        <Text fontSize="sm">{cell.value}</Text>
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        );

      default:
        return <Text color="gray.500">{answer?.answer || "No answer"}</Text>;
    }
  };

  return (
    <VStack align="stretch" spacing={4} w="100%">
      <HStack justify="space-between">
        <HStack justify="center">
          {response.userEmail && (
            <Text fontSize="sm" color="black" fontWeight="bold">
              {response.userEmail} -
            </Text>
          )}
          <Text fontSize="sm" color="gray.500" fontWeight="bold">
            Submitted at: {new Date(response.submittedAt).toLocaleString()}
          </Text>
        </HStack>

        {onDelete && (
          <IconButton
            size="sm"
            colorScheme="red"
            variant="outline"
            icon={<FaTrash />}
            onClick={() => onDelete(response.responseId)}
            aria-label="Delete response"
          />
        )}
      </HStack>

      {sortedQuestions.map((question) => {
        const answer = response.answers.find(
          (a) => a.questionId === question.id
        );
        const iconConfig =
          questionTypeIcons[question.type as keyof typeof questionTypeIcons];

        return (
          <Box
            key={question.id}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            bg="white"
            boxShadow="sm"
          >
            <HStack mb={3} align="center">
              {iconConfig && (
                <Icon
                  as={iconConfig.icon}
                  color={iconConfig.color}
                  boxSize={5}
                />
              )}
              <Text fontWeight="semibold" fontSize="md" color="gray.700">
                {question.questionText}
              </Text>
              {question.isRequired === true && (
                <Text fontSize="sm" color="red.500">
                  *
                </Text>
              )}
            </HStack>

            {answer ? (
              renderAnswer(question, answer)
            ) : (
              <Text color="gray.500">No answer</Text>
            )}
          </Box>
        );
      })}
    </VStack>
  );
};

export default ResponseCard;
