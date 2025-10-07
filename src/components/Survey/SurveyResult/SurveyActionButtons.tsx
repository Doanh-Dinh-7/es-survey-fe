import { IconButton, Tooltip, ButtonGroup } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getSurvey } from "../../../services/survey";
import SurveyResult from "../../../pages/CreatorPages/SurveyResult";
import ExportSurveyButton from "./ExportFeature/ExportSurveyButton";
import { FiEdit, FiX } from "react-icons/fi";

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
    <ButtonGroup spacing={4}>
      <Tooltip label="View Content" hasArrow>
        <IconButton
          aria-label="View Content"
          icon={<FiEdit />}
          variant="outline"
          colorScheme="blue"
          onClick={handleNavContent}
          _hover={{
            bg: "blue.500",
            color: "white",
          }}
        />
      </Tooltip>

      {survey.status === "PUBLISHED" && (
        <Tooltip label="Close Survey" hasArrow>
          <IconButton
            aria-label="Close Survey"
            icon={<FiX />}
            colorScheme="red"
            variant="outline"
            onClick={onClose}
            _hover={{
              bg: "red.500",
              color: "white",
            }}
          />
        </Tooltip>
      )}

      <ExportSurveyButton survey={survey} />
    </ButtonGroup>
  );
};

export default SurveyActionButtons;
