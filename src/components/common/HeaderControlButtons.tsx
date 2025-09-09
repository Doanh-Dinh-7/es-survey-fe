import { ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiPieChart, FiSave, FiShare2 } from "react-icons/fi";
import { IoBookmarkOutline, IoDuplicateOutline } from "react-icons/io5";

interface HeaderControlButtonsProps {
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onClone?: () => void;
  onSaveAsTemplate?: () => void;
  surveyId?: string;
  isPublishedSurvey?: boolean;
  isClosedSurvey?: boolean;
  isViewMode?: boolean;
}

const HeaderControlButtons = ({
  onSave,
  onPreview,
  onPublish,
  onClone,
  onSaveAsTemplate,
  surveyId,
  isPublishedSurvey,
  isClosedSurvey,
  isViewMode = false,
}: HeaderControlButtonsProps) => {
  const navigate = useNavigate();

  const handleViewResult = () => {
    navigate(`/survey-result/${surveyId}`);
  };

  return (
    <ButtonGroup spacing={4}>
      {!isViewMode && (
        <Tooltip label="Save" hasArrow>
          <IconButton
            aria-label="Save"
            icon={<FiSave />}
            colorScheme="blue"
            color="white"
            _hover={{
              bg: "white",
              color: "blue.500",
            }}
            onClick={onSave}
          />
        </Tooltip>
      )}
      <Tooltip label="Preview" hasArrow>
        <IconButton
          aria-label="Preview"
          variant="outline"
          icon={<FiEye />}
          onClick={onPreview}
          _hover={{
            bg: "gray.500",
            color: "white",
          }}
        />
      </Tooltip>
      {surveyId && (
        <>
          <Tooltip label="Clone" hasArrow>
            <IconButton
              aria-label="Clone"
              icon={<IoDuplicateOutline />}
              variant="outline"
              onClick={onClone}
              _hover={{
                bg: "gray.500",
                color: "white",
              }}
            />
          </Tooltip>
          {!isClosedSurvey && (
            <Tooltip
              label={isPublishedSurvey ? "Share" : "Publish Now"}
              hasArrow
            >
              <IconButton
                aria-label={isPublishedSurvey ? "Share" : "Publish Now"}
                icon={<FiShare2 />}
                onClick={onPublish}
                colorScheme={isPublishedSurvey ? "blue" : "green"}
                _hover={{
                  color: isPublishedSurvey ? "blue.500" : "green.500",
                  bg: "white",
                }}
              />
            </Tooltip>
          )}
          <Tooltip label="View result" hasArrow>
            <IconButton
              aria-label="view result"
              icon={<FiPieChart />}
              variant="outline"
              colorScheme="green"
              onClick={handleViewResult}
              _hover={{
                bg: "green.500",
                color: "white",
              }}
            />
          </Tooltip>
          <Tooltip label="Save as Template" hasArrow>
            <IconButton
              aria-label="Save as Template"
              icon={<IoBookmarkOutline />}
              colorScheme="purple"
              variant="outline"
              onClick={onSaveAsTemplate}
              _hover={{
                bg: "purple.500",
                color: "white",
              }}
            />
          </Tooltip>
        </>
      )}
    </ButtonGroup>
  );
};

export default HeaderControlButtons;
