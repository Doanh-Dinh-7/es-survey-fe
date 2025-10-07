import {
  Box,
  Text,
  Heading,
  Stack,
  Progress,
  List,
  ListItem,
  Flex,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
} from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface Question {
  questionId: string;
  questionText: string;
  type: string;
  summary?: any;
  totalResponses: number;
}

interface QuestionBlockProps {
  question: Question;
}

const COLORS = [
  "#3182CE",
  "#34A853",
  "#FBBC05",
  "#EA4335",
  "#A259FF",
  "#FF6F00",
  "#00B8D9",
  "#FF4081",
  "#7C4DFF",
  "#00C853",
];

const renderPieLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent, name, index } = props;
  if (percent === 0) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill={COLORS[index % COLORS.length]}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={14}
      fontWeight={600}
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ChartDisplay = ({ question }: { question: Question }) => {
  if (question.type === "multiple_choice") {
    return (
      <Box h="300px" w="100%">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={question.summary}
              dataKey="count"
              nameKey="optionText"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={renderPieLabel}
              labelLine={false}
            >
              {question.summary?.map((_entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    );
  }
  if (question.type === "checkbox") {
    return (
      <Box h="300px" w="100%">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={question.summary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="optionText" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count">
              {question.summary?.map((_entry: any, index: number) => (
                <Cell
                  key={`cell-bar-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }
  return null;
};

const ListAnswerDisplay = ({ question }: { question: Question }) => {
  const isScrollable = (question.summary?.length || 0) > 5;
  const listContent = (
    <List spacing={3}>
      {question.summary?.map((answer: any, index: number) => (
        <ListItem
          key={index}
          p={3}
          bg="white"
          borderRadius="md"
          border="1px solid"
          borderColor="blue.200"
          boxShadow="md"
        >
          <Flex justify="space-between" align="center" gap="3">
            <Text textAlign="justify">{answer.value}</Text>
            <Badge colorScheme="blue">{answer.count} responses</Badge>
          </Flex>
        </ListItem>
      ))}
    </List>
  );
  return isScrollable ? (
    <Box maxH="27vh" overflowY="auto">
      {listContent}
    </Box>
  ) : (
    listContent
  );
};

const QuestionBlock = ({ question }: QuestionBlockProps) => (
  <Box borderWidth="1px" borderRadius="lg" p={4} mb={6}>
    <Heading fontWeight="bold" mb={2}>
      {question.questionText}
    </Heading>
    <Text fontSize="sm" color="gray.500" mb={4}>
      {question.totalResponses} responses
    </Text>
    {(question.type === "multiple_choice" || question.type === "checkbox") && (
      <>
        <ChartDisplay question={question} />
        <Stack mt={4} spacing={2}>
          {question.summary?.map((option: any, index: number) => (
            <Box key={index}>
              <Flex justify="space-between" mb={1}>
                <Text>{option.optionText}</Text>
                <Text>{option.percentage}%</Text>
              </Flex>
              <Progress
                value={option.percentage}
                bg="gray.100"
                sx={{
                  "& > div": {
                    background: COLORS[index % COLORS.length],
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </>
    )}
    {(question.type === "short_text" || question.type === "long_text") && (
      <ListAnswerDisplay question={question} />
    )}
    {question.type === "matrix_choice" && (
      <VStack spacing={6} align="stretch">
        {question.summary?.map((row: any, rowIndex: number) => (
          <Box
            key={rowIndex}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            bg="gray.50"
          >
            <Heading size="sm" mb={4} color="blue.700">
              {row.rowLabel}
            </Heading>
            {/* Pie Chart for this row */}
            <Box h="250px" w="100%">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={row.columns}
                    dataKey="count"
                    nameKey="columnLabel"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={renderPieLabel}
                    labelLine={false}
                  >
                    {row.columns?.map((_col: any, colIndex: number) => (
                      <Cell
                        key={`cell-${rowIndex}-${colIndex}`}
                        fill={COLORS[colIndex % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            {/* Statistics */}
            <Stack mt={4} spacing={2}>
              {row.columns?.map((col: any, colIndex: number) => (
                <Box key={colIndex}>
                  <Flex justify="space-between" mb={1}>
                    <Text fontSize="sm">{col.columnLabel}</Text>
                    <Text fontSize="sm" fontWeight="bold">
                      {col.count} ({col.percentage}%)
                    </Text>
                  </Flex>
                  <Progress
                    value={col.percentage}
                    bg="gray.200"
                    sx={{
                      "& > div": {
                        background: COLORS[colIndex % COLORS.length],
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </VStack>
    )}
    {question.type === "matrix_input" && (
      <Box overflowX="auto">
        <Table size="sm" variant="simple">
          <Thead bg="green.50">
            <Tr>
              <Th>Questions</Th>
              {question.summary?.[0]?.columns?.map(
                (col: any, colIndex: number) => (
                  <Th key={colIndex}>{col.columnLabel}</Th>
                )
              )}
            </Tr>
          </Thead>
          <Tbody>
            {question.summary?.map((row: any, rowIndex: number) => (
              <Tr key={rowIndex}>
                <Td fontWeight="medium">{row.rowLabel}</Td>
                {row.columns?.map((col: any, colIndex: number) => (
                  <Td key={colIndex}>
                    <Box maxH="150px" overflowY="auto">
                      <List spacing={1}>
                        {col.answers
                          ?.slice(0, 5)
                          .map((ans: string, ansIndex: number) => (
                            <ListItem
                              key={ansIndex}
                              fontSize="xs"
                              p={1}
                              bg="gray.50"
                              borderRadius="sm"
                            >
                              {ans}
                            </ListItem>
                          ))}
                        {col.answers?.length > 5 && (
                          <Text fontSize="xs" color="blue.500" mt={1}>
                            +{col.answers.length - 5} more...
                          </Text>
                        )}
                      </List>
                    </Box>
                    <Badge colorScheme="green" mt={1}>
                      {col.count} responses
                    </Badge>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    )}
  </Box>
);

export default QuestionBlock;
