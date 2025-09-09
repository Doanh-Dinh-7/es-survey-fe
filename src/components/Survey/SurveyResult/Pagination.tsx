import { Flex, Button, Text } from "@chakra-ui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Flex justify="space-between" align="center" w="100%" py={4}>
      <Button
        onClick={handlePrevPage}
        isDisabled={currentPage === 1}
        colorScheme="blue"
        variant="outline"
      >
        Previous Response
      </Button>
      <Text>
        Response {currentPage} of {totalPages}
      </Text>
      <Button
        onClick={handleNextPage}
        isDisabled={currentPage === totalPages}
        colorScheme="blue"
        variant="outline"
      >
        Next Response
      </Button>
    </Flex>
  );
};

export default Pagination; 