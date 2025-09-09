import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useToast,
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  changeStatusSurvey,
  getSlackChannels,
  sendSlackNotification,
} from "../../services/survey";

interface SlackPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  onSuccess: () => void;
  isPublishedSurvey: boolean;
  isClosedSurvey: boolean;
}

interface SlackChannel {
  id: string;
  name: string;
}

const SlackPublishModal = ({
  isOpen,
  onClose,
  surveyId,
  onSuccess,
  isPublishedSurvey,
  isClosedSurvey,
}: SlackPublishModalProps) => {
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    }
  }, [isOpen]);

  const fetchChannels = async () => {
    setIsLoadingChannels(true);
    try {
      const response = await getSlackChannels();
      setChannels(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Can't fetch channel list",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingChannels(false);
    }
  };

  const handleSend = async () => {
    setIsLoading(true);
    try {
      if (isPublishedSurvey && selectedChannels.length !== 0) {
        const payLoad = {
          surveyId,
          channels: selectedChannels,
          message,
        };

        await sendSlackNotification(payLoad);
      } else if (!isPublishedSurvey) {
        await changeStatusSurvey(surveyId, selectedChannels, message);
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Can't send message to Slack",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChannelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedChannels(selectedOptions);
    console.log(selectedChannels);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send a notification to Slack</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={2} fontWeight="bold">
                Select Channels
              </Text>
              {isLoadingChannels ? (
                <HStack justify="center" py={4}>
                  <Spinner />
                  <Text>Loading channel list...</Text>
                </HStack>
              ) : (
                <CheckboxGroup
                  value={selectedChannels}
                  onChange={(val) => setSelectedChannels(val as string[])}
                >
                  <VStack align="start" maxH="200px" overflowY="auto">
                    {channels.map((channel) => (
                      <Checkbox key={channel.id} value={channel.id}>
                        #{channel.name}
                      </Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              )}
            </Box>

            <Box>
              <Text mb={2} fontWeight="bold">
                Custom Message
              </Text>
              <Input
                placeholder="Enter custom message (can be @here, @channel...)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                size="md"
              />
            </Box>

            <HStack spacing={3} justify="flex-end" pt={2}>
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSend}
                isLoading={isLoading}
                loadingText="Đang gửi..."
                isDisabled={isClosedSurvey}
              >
                {selectedChannels.length === 0 ? "Get Link" : "Send"}
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SlackPublishModal;
