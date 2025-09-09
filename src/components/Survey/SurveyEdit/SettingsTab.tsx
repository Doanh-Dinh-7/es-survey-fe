import {
  Heading,
  VStack,
  Flex,
  Box,
  Text,
  FormControl,
  Input,
  FormErrorMessage,
  Textarea,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { SurveySettings } from "../../../types/question.types";

interface SettingsTabProps {
  settings: SurveySettings;
  setSettings: React.Dispatch<React.SetStateAction<SurveySettings>>;
  isClosedSurvey: boolean;
  isPublishedSurvey: boolean;
  isViewMode: boolean;
  openTimeError: string;
  closeTimeError: string;
  handleSaveSettings: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  setSettings,
  isClosedSurvey,
  isPublishedSurvey,
  isViewMode,
  openTimeError,
  closeTimeError,
  handleSaveSettings,
}) => {
  return (
    <VStack spacing={4} align="stretch" gap={7}>
      <Heading as="h2" size="lg">
        Survey Settings
      </Heading>
      <Flex
        direction="column"
        gap="9"
        bg="white"
        p={4}
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="lg"
      >
        <Flex justifyContent="space-between">
          <Box textAlign="left">
            <Text mb={2} fontWeight="bold">
              Require Email
            </Text>
            <FormControl display="flex" alignItems="center">
              <input
                id="requireEmail"
                type="checkbox"
                checked={!!settings.requireEmail}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    requireEmail: e.target.checked,
                  }))
                }
                disabled={isClosedSurvey}
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
              <Text
                as="span"
                fontSize="sm"
                _hover={{ cursor: !isClosedSurvey ? "pointer" : "not-allowed" }}
                onClick={() => {
                  !isClosedSurvey &&
                    setSettings((prev) => ({
                      ...prev,
                      requireEmail: !prev.requireEmail,
                    }));
                }}
              >
                Allow users to submit their email address
              </Text>
            </FormControl>
          </Box>
          <Box textAlign="left">
            <Text mb={2} fontWeight="bold">
              Allow Multiple Responses
            </Text>
            <FormControl display="flex" alignItems="center">
              <input
                type="checkbox"
                checked={!!settings.allowMultipleResponses}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    allowMultipleResponses: e.target.checked,
                  }))
                }
                disabled={isClosedSurvey}
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
              <Text
                as="span"
                fontSize="sm"
                _hover={{ cursor: !isClosedSurvey ? "pointer" : "not-allowed" }}
                onClick={() => {
                  !isClosedSurvey &&
                    setSettings((prev) => ({
                      ...prev,
                      allowMultipleResponses: !prev.allowMultipleResponses,
                    }));
                }}
              >
                Allow users to submit multiple responses
              </Text>
            </FormControl>
          </Box>
        </Flex>
        <Box textAlign="left">
          <Text mb={2} fontWeight="bold">
            Time Settings
          </Text>
          <VStack
            spacing={3}
            flexDirection={{ base: "column", md: "row" }}
            justifyContent={"space-between"}
          >
            <Box display="inline-block">
              <Text mb={1} fontSize="sm">
                Open Date & Time
              </Text>
              <FormControl
                isInvalid={
                  !!openTimeError && !isClosedSurvey && !isPublishedSurvey
                }
              >
                <Input
                  type="datetime-local"
                  value={
                    settings.openTime
                      ? new Date(settings.openTime)
                          .toLocaleString("sv-SE", { hour12: false })
                          .replace(" ", "T")
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      openTime: e.target.value || null,
                    }))
                  }
                  isDisabled={isClosedSurvey || isPublishedSurvey}
                  isReadOnly={isViewMode}
                />
                {!isClosedSurvey && !isPublishedSurvey && (
                  <FormErrorMessage>{openTimeError}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
            <Box>
              <Text mb={1} fontSize="sm">
                Close Date & Time
              </Text>
              <FormControl isInvalid={!!closeTimeError && !isClosedSurvey}>
                <Input
                  type="datetime-local"
                  value={
                    settings.closeTime
                      ? new Date(settings.closeTime)
                          .toLocaleString("sv-SE", { hour12: false })
                          .replace(" ", "T")
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      closeTime: e.target.value || null,
                    }))
                  }
                  isDisabled={isClosedSurvey}
                />
                {!isClosedSurvey && (
                  <FormErrorMessage>{closeTimeError}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
          </VStack>
        </Box>
        <Box textAlign="left">
          <Text mb={2} fontWeight="bold">
            Maximum Responses
          </Text>
          <Input
            type="number"
            value={settings.maxResponse || ""}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                maxResponse: e.target.value ? parseInt(e.target.value) : null,
              }))
            }
            placeholder="Enter maximum number of responses"
            isDisabled={isClosedSurvey}
          />
        </Box>
        <Box>
          <Text mb={2} fontWeight="bold" textAlign="left">
            Thanks for your response letter
          </Text>
          <FormControl isInvalid={!settings.responseLetter && !isClosedSurvey}>
            <Textarea
              placeholder="Thank you for your response letter"
              value={settings.responseLetter || ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  responseLetter: e.target.value,
                }))
              }
              isDisabled={isClosedSurvey}
              isRequired={true}
            />
            {!settings.responseLetter && !isClosedSurvey && (
              <FormErrorMessage>Response letter is required</FormErrorMessage>
            )}
          </FormControl>
        </Box>
        {isViewMode && !isClosedSurvey && (
          <Button
            colorScheme="blue"
            mt={4}
            alignSelf="flex-end"
            onClick={handleSaveSettings}
          >
            Save Changes
          </Button>
        )}
      </Flex>
    </VStack>
  );
};

export default SettingsTab;
