import {
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
} from "@chakra-ui/react";
import { FC } from "react";
import { BiPlus, BiTrash } from "react-icons/bi";
import { MatrixRow, MatrixColumn } from "../../../../types/question.types";

interface Props {
  matrixRows: MatrixRow[];
  matrixColumns: MatrixColumn[];
  onChange?: (rows: MatrixRow[], columns: MatrixColumn[]) => void;
  isReadOnly?: boolean;
  isDisabled?: boolean;
}

const MatrixInputInput: FC<Props> = ({
  matrixRows,
  matrixColumns,
  onChange,
  isReadOnly,
  isDisabled,
}) => {
  const handleAddRow = () => {
    if (onChange) {
      const newRow: MatrixRow = {
        label: `Row ${matrixRows.length + 1}`,
        order: matrixRows.length + 1,
      };
      onChange([...matrixRows, newRow], matrixColumns);
    }
  };

  const handleRemoveRow = (index: number) => {
    if (onChange) {
      const newRows = matrixRows.filter((_, i) => i !== index);
      // Cập nhật order
      const updatedRows = newRows.map((row, i) => ({ ...row, order: i + 1 }));
      onChange(updatedRows, matrixColumns);
    }
  };

  const handleRowChange = (index: number, value: string) => {
    if (onChange) {
      const newRows = matrixRows.map((row, i) =>
        i === index ? { ...row, label: value } : row
      );
      onChange(newRows, matrixColumns);
    }
  };

  const handleAddColumn = () => {
    if (onChange) {
      const newColumn: MatrixColumn = {
        label: `Column ${matrixColumns.length + 1}`,
        order: matrixColumns.length + 1,
      };
      onChange(matrixRows, [...matrixColumns, newColumn]);
    }
  };

  const handleRemoveColumn = (index: number) => {
    if (onChange) {
      const newColumns = matrixColumns.filter((_, i) => i !== index);
      // Cập nhật order
      const updatedColumns = newColumns.map((col, i) => ({
        ...col,
        order: i + 1,
      }));
      onChange(matrixRows, updatedColumns);
    }
  };

  const handleColumnChange = (index: number, value: string) => {
    if (onChange) {
      const newColumns = matrixColumns.map((col, i) =>
        i === index ? { ...col, label: value } : col
      );
      onChange(matrixRows, newColumns);
    }
  };

  return (
    <VStack align="start" spacing={6} w="full">
      <Text fontSize="sm" color="gray.500">
        * Matrix input: User will enter text for each row and column combination
      </Text>

      {/* Table 1: Questions (Rows) */}
      <Box w="full">
        <Text fontSize="sm" fontWeight="bold" mb={2} color="blue.600">
          📋 Questions (Rows):
        </Text>
        <Box overflowX="auto" w="full">
          <Table size="sm" variant="simple" bg="white">
            <Thead bg="blue.50">
              <Tr>
                <Th w="120px">#</Th>
                <Th>Question Label</Th>
                {!isReadOnly && <Th w="80px">Action</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {matrixRows.map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    <Text fontSize="sm" fontWeight="medium">
                      Row {rowIndex + 1}
                    </Text>
                  </Td>
                  <Td>
                    <Input
                      value={row.label}
                      onChange={(e) =>
                        handleRowChange(rowIndex, e.target.value)
                      }
                      size="sm"
                      placeholder={`Enter question ${rowIndex + 1}`}
                      isReadOnly={isReadOnly}
                      isDisabled={isDisabled}
                    />
                  </Td>
                  {!isReadOnly && (
                    <Td>
                      <IconButton
                        aria-label="Remove row"
                        icon={<BiTrash />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveRow(rowIndex)}
                        isDisabled={isDisabled}
                      />
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        {!isReadOnly && (
          <HStack spacing={2} mt={2}>
            <IconButton
              aria-label="Add row"
              icon={<BiPlus />}
              size="sm"
              colorScheme="blue"
              onClick={handleAddRow}
              isDisabled={isDisabled}
            />
            <Text fontSize="sm" color="gray.600">
              Add Question Row
            </Text>
          </HStack>
        )}
      </Box>

      {/* Table 2: Input Columns */}
      <Box w="full">
        <Text fontSize="sm" fontWeight="bold" mb={2} color="green.600">
          ✏️ Input Columns:
        </Text>
        <Box overflowX="auto" w="full">
          <Table size="sm" variant="simple" bg="white">
            <Thead bg="green.50">
              <Tr>
                <Th w="120px">#</Th>
                <Th>Column Label</Th>
                {!isReadOnly && <Th w="80px">Action</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {matrixColumns.map((column, colIndex) => (
                <Tr key={colIndex}>
                  <Td>
                    <Text fontSize="sm" fontWeight="medium">
                      Column {colIndex + 1}
                    </Text>
                  </Td>
                  <Td>
                    <Input
                      value={column.label}
                      onChange={(e) =>
                        handleColumnChange(colIndex, e.target.value)
                      }
                      size="sm"
                      placeholder={`Enter column ${colIndex + 1}`}
                      isReadOnly={isReadOnly}
                      isDisabled={isDisabled}
                    />
                  </Td>
                  {!isReadOnly && (
                    <Td>
                      <IconButton
                        aria-label="Remove column"
                        icon={<BiTrash />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveColumn(colIndex)}
                        isDisabled={isDisabled || matrixColumns.length <= 1}
                      />
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        {!isReadOnly && (
          <HStack spacing={2} mt={2}>
            <IconButton
              aria-label="Add column"
              icon={<BiPlus />}
              size="sm"
              colorScheme="green"
              onClick={handleAddColumn}
              isDisabled={isDisabled}
            />
            <Text fontSize="sm" color="gray.600">
              Add Input Column
            </Text>
          </HStack>
        )}
      </Box>
    </VStack>
  );
};

export default MatrixInputInput;
