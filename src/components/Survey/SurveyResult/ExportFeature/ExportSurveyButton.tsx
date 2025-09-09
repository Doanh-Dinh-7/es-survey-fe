import { useState } from "react";
import { Button } from "@chakra-ui/react";
import ExportSurveyModal from "./ExportSurveyModal";

const ExportSurveyButton = ({ survey }: { survey: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button colorScheme="blue" onClick={() => setIsOpen(true)}>
        Export
      </Button>
      <ExportSurveyModal isOpen={isOpen} onClose={() => setIsOpen(false)} survey={survey} />
    </>
  );
};

export default ExportSurveyButton; 