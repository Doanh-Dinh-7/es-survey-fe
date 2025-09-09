import { HStack, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getSurvey } from "../../../services/survey";
import SurveyResult from "../../../pages/CreatorPages/SurveyResult";
import ExportSurveyButton from "./ExportFeature/ExportSurveyButton";


interface SurveyActionButtonsProps {
  onClose: () => void;
  survey: SurveyResult;
}

const SurveyActionButtons = ({ onClose, survey }: SurveyActionButtonsProps) => {
  const navigate = useNavigate();
  const handleNavContent = async () => {
    const res = await getSurvey(survey.surveyId);
      navigate("/survey-editor", {
        state: {
          mode: survey.status === "PENDING" ? "edit" : "view",
          survey: res.data.survey,
        },
      });
    
  };
  return (
    <HStack spacing={4} justify="flex-end" py={4}>
      <Button variant="outline" colorScheme="success" onClick={handleNavContent}>
      Content
    </Button>
    {survey.status === "PUBLISHED" && (
      <Button colorScheme="gray" onClick={onClose}>Close</Button>
    )}
    <ExportSurveyButton survey={survey} />
  </HStack>
  );
};

export default SurveyActionButtons; 