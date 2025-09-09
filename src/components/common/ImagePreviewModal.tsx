import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Image,
} from "@chakra-ui/react";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
}) => {
  return (
    <Modal isOpen={!!imageUrl && isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent bg="transparent" boxShadow="none" maxW="90vw">
        <ModalCloseButton color="white" zIndex={2} onClick={onClose} />
        <ModalBody
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={0}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Preview"
              maxH="80vh"
              maxW="90vw"
              borderRadius="lg"
              boxShadow="xl"
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImagePreviewModal;
