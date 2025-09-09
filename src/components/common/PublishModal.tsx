import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Input,
  useToast,
  Box,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";
import { FiCopy } from "react-icons/fi";

interface PublishModalProps {
  status: string;
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

const PublishModal = ({ isOpen, onClose, surveyUrl }: PublishModalProps) => {
  const toast = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    toast({
      title: "Link copied",
      description: "Survey link has been copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
      variant: "solid",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Survey Published</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={1}>
            <Text mb={2} fontWeight="bold">
              Survey Link
            </Text>
            <Flex position="relative">
              <Input value={surveyUrl} readOnly borderRadius="md" />
              <IconButton
                icon={<FiCopy />}
                position="absolute"
                right="2px"
                top="2px"
                size="sm"
                onClick={handleCopyLink}
                height="calc(100% - 4px)"
                bg="blue.400"
                color="white"
                _hover={{ bg: "blue.500", opacity: 1 }}
                aria-label="Copy Link"
                opacity={0.8}
                transition="opacity 0.2s"
              />
            </Flex>
          </Box>

          <Box mb={1}>
            <Text mb={2} fontWeight="bold">
              QR Code
            </Text>
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <QRCodeSVG value={surveyUrl} size={200} />
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PublishModal;
