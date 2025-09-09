import { useSortable } from "@dnd-kit/sortable";
import QuestionItem from "./QuestionItem";
import { CSS } from "@dnd-kit/utilities";
import { Question } from "../../../types/question.types";
import { Box } from "@chakra-ui/react";
import { GripVertical } from "lucide-react";

interface SortableQuestionItemProps {
  id?: string;
  question: Question;
  onChange: (order: number, field: string, value: any) => void;
  onDelete: (order: number) => void;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  mode?: "create" | "edit" | "view";
  handleMarkDeleteMedia?: (mediaUrl: string) => void;
}

export const SortableQuestionItem = ({
  id,
  question,
  onChange,
  onDelete,
  isReadOnly = false,
  isDisabled = false,
  handleMarkDeleteMedia,
}: SortableQuestionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id || question.order.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style} position="relative">
      <Box
        position="absolute"
        left="-30px"
        top="50%"
        transform="translateY(-50%)"
        // cursor="grab"
        cursor={isReadOnly || isDisabled ? "not-allowed" : "move"}
        {...(!isReadOnly ? attributes : {})}
        {...(!isReadOnly ? listeners : {})}
        _disabled={{ cursor: "not-allowed" }}
      >
        <GripVertical size={20} />
      </Box>
      <QuestionItem
        order={question.order}
        questionText={question.questionText}
        questionMediaUrl={question.questionMediaUrl}
        type={question.type}
        isRequired={question.isRequired}
        options={question.options}
        onChange={onChange}
        onDelete={onDelete}
        isReadOnly={isReadOnly}
        isDisabled={isDisabled}
        handleMarkDeleteMedia={handleMarkDeleteMedia}
      />
    </Box>
  );

  // return (
  //   <Box
  //     ref={setNodeRef}
  //     style={style}
  //     p={4}
  //     borderWidth="1px"
  //     borderRadius="md"
  //     bg="white"
  //     position="relative"
  //     cursor={isReadOnly ? "default" : "move"}
  //   >
  //     {!isReadOnly && (
  //       <Box
  //         position="absolute"
  //         left="-30px"
  //         top="50%"
  //         transform="translateY(-50%)"
  //         cursor="grab"
  //         {...attributes}
  //         {...listeners}
  //       >
  //         <GripVertical size={20} />
  //       </Box>
  //     )}

  //     <Flex justify="space-between" align="center" mb={4}>
  //       <Text fontWeight="bold">Question {question.order}</Text>
  //       {!isReadOnly && (
  //         <IconButton
  //           aria-label="Delete question"
  //           icon={<DeleteIcon />}
  //           size="sm"
  //           onClick={() => onDelete(id)}
  //         />
  //       )}
  //     </Flex>

  //     <VStack spacing={4} align="stretch">
  //       <Input
  //         value={question.questionText}
  //         onChange={(e) => onChange(id, "questionText", e.target.value)}
  //         placeholder="Enter your question"
  //         isReadOnly={isReadOnly}
  //         bg={isReadOnly ? "gray.50" : "white"}
  //       />

  //       <Select
  //         value={question.type}
  //         onChange={(e) => onChange(id, "type", e.target.value)}
  //         isReadOnly={isReadOnly}
  //         bg={isReadOnly ? "gray.50" : "white"}
  //       >
  //         <option value="short_text">Short Text</option>
  //         <option value="long_text">Long Text</option>
  //         <option value="multiple_choice">Multiple Choice</option>
  //         <option value="checkbox">Checkbox</option>
  //       </Select>

  //       {(question.type === "multiple_choice" || question.type === "checkbox") && (
  //         <VStack spacing={2} align="stretch">
  //           {question.options?.map((option, index) => (
  //             <Flex key={index} gap={2}>
  //               <Input
  //                 value={option.optionText}
  //                 onChange={(e) => {
  //                   const newOptions = [...(question.options || [])];
  //                   newOptions[index] = { ...option, optionText: e.target.value };
  //                   onChange(id, "options", newOptions);
  //                 }}
  //                 placeholder={`Option ${index + 1}`}
  //                 isReadOnly={isReadOnly}
  //                 bg={isReadOnly ? "gray.50" : "white"}
  //               />
  //               {!isReadOnly && (
  //                 <IconButton
  //                   aria-label="Delete option"
  //                   icon={<DeleteIcon />}
  //                   size="sm"
  //                   onClick={() => {
  //                     const newOptions = question.options?.filter((_, i) => i !== index);
  //                     onChange(id, "options", newOptions);
  //                   }}
  //                 />
  //               )}
  //             </Flex>
  //           ))}
  //           {!isReadOnly && (
  //             <Button
  //               size="sm"
  //               leftIcon={<PlusIcon />}
  //               onClick={() => {
  //                 const newOptions = [
  //                   ...(question.options || []),
  //                   { optionText: `Option ${(question.options?.length || 0) + 1}` },
  //                 ];
  //                 onChange(id, "options", newOptions);
  //               }}
  //             >
  //               Add Option
  //             </Button>
  //           )}
  //         </VStack>
  //       )}

  //       <Checkbox
  //         isChecked={question.isRequired}
  //         onChange={(e) => onChange(id, "isRequired", e.target.checked)}
  //         isReadOnly={isReadOnly}
  //         colorScheme={isReadOnly ? "gray" : "blue"}
  //       >
  //         Required
  //       </Checkbox>
  //     </VStack>
  //   </Box>
  // );
};
