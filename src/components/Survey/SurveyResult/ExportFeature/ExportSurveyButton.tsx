import { useState } from "react";
import { IconButton, Tooltip } from "@chakra-ui/react";
import ExportSurveyModal from "./ExportSurveyModal";
import { FiDownload } from "react-icons/fi";

const ExportSurveyButton = ({ survey }: { survey: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Tooltip label="Export Data" hasArrow>
        <IconButton
          aria-label="Export Data"
          icon={<FiDownload />}
          colorScheme="purple"
          variant="outline"
          onClick={() => setIsOpen(true)}
          _hover={{
            bg: "purple.500",
            color: "white",
          }}
        />
      </Tooltip>
      <ExportSurveyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        survey={survey}
      />
    </>
  );
};

export default ExportSurveyButton;
