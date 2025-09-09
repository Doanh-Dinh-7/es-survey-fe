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
} from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Question {
  questionId: string;
  questionText: string;
  type: string;
  summary?: {
    optionText: string;
    count: number;
    percentage: number;
    value: string;
  }[];
  totalResponses: number;
}

interface QuestionBlockProps {
  question: Question;
}

const COLORS = [
  '#3182CE', '#34A853', '#FBBC05', '#EA4335', '#A259FF', '#FF6F00', '#00B8D9', '#FF4081', '#7C4DFF', '#00C853'
];

const renderPieLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name, index } = props;
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
  if (question.type === 'multiple_choice') {
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
              {question.summary?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    );
  }
  if (question.type === 'checkbox') {
    return (
      <Box h="300px" w="100%">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={question.summary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="optionText" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count">
              {question.summary?.map((entry, index) => (
                <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
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
        {question.summary?.map((answer, index) => (
          <ListItem key={index} p={3} bg="white" borderRadius="md" border="1px solid" borderColor="blue.200" boxShadow="md">
            <Flex justify="space-between" align="center" gap="3" >
              <Text textAlign="justify">{answer.value}</Text>
              <Badge colorScheme="blue">{answer.count} responses</Badge>
            </Flex>
          </ListItem>
        ))}
      </List>
    );
  return isScrollable ? (
    <Box maxH="27vh" overflowY="auto">{listContent}</Box>
  ) : listContent;
};

const QuestionBlock = ({ question }: QuestionBlockProps) => (
  <Box borderWidth="1px" borderRadius="lg" p={4} mb={6}>
    <Heading fontWeight="bold" mb={2}>{question.questionText}</Heading>
    <Text fontSize="sm" color="gray.500" mb={4}>
      {question.totalResponses} responses
    </Text>
    {(question.type === 'multiple_choice' || question.type === 'checkbox') && (
      <>
        <ChartDisplay question={question} />
        <Stack mt={4} spacing={2}>
          {question.summary?.map((option, index) => (
            <Box key={index}>
              <Flex justify="space-between" mb={1}>
                <Text>{option.optionText}</Text>
                <Text>{option.percentage}%</Text>
              </Flex>
              <Progress value={option.percentage} bg="gray.100" sx={{
                '& > div': {
                  background: COLORS[index % COLORS.length],
                }
              }} />
            </Box>
          ))}
        </Stack>
      </>
    )}
    {(question.type === 'short_text' || question.type === 'long_text') && (
      <ListAnswerDisplay question={question} />
    )}
  </Box>
);

export default QuestionBlock; 