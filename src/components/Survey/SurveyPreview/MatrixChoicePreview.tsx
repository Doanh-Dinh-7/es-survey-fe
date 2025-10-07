import { FC } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Radio,
  VStack,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { MatrixRow, MatrixColumn } from "../../../types/question.types";

interface Props {
  questionId: string;
  matrixRows: MatrixRow[];
  matrixColumns: MatrixColumn[];
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  isRequired?: boolean;
  error?: string | null;
}

const MatrixChoicePreview: FC<Props> = ({
  questionId,
  matrixRows,
  matrixColumns,
  value,
  onChange,
  isRequired,
  error,
}) => {
  const handleChange = (rowId: string, columnId: string) => {
    onChange({
      ...value,
      [rowId]: columnId,
    });
  };

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <VStack align="stretch" spacing={3}>
        <Table size="sm" variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Questions</Th>
              {matrixColumns?.map((column, colIndex) => (
                <Th key={colIndex} textAlign="center">
                  {column.label}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {matrixRows?.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                <Td fontWeight="medium">{row.label}</Td>
                {matrixColumns?.map((column, colIndex) => (
                  <Td key={colIndex} textAlign="center">
                    <Radio
                      value={column.id || `col-${colIndex}`}
                      isChecked={
                        value?.[row.id || `row-${rowIndex}`] ===
                        (column.id || `col-${colIndex}`)
                      }
                      onChange={() =>
                        handleChange(
                          row.id || `row-${rowIndex}`,
                          column.id || `col-${colIndex}`
                        )
                      }
                    />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default MatrixChoicePreview;
