import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";

interface ModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmColorScheme?: string;
  loading?: boolean;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmColorScheme = "blue",
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button
            colorScheme={confirmColorScheme}
            onClick={onConfirm}
            isLoading={loading}
            isDisabled={loading}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalConfirm;
