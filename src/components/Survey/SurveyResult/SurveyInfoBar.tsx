import { Flex, Heading } from "@chakra-ui/react";

interface SurveyInfoBarProps {
  title: string;
}

const SurveyInfoBar = ({ title }: SurveyInfoBarProps) => (
  <Flex justify="space-between" justifyContent="center" align="center" mb={4}>
    <Heading wordBreak="break-word">{title}</Heading>
  </Flex>
);

export default SurveyInfoBar;
