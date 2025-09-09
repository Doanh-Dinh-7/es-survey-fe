import { Box, Text } from "@chakra-ui/react";

const Footer: React.FC = () => {
  return (
    <Box
      as="footer"
      width="100%"
      marginTop="auto"
      paddingBottom="5"
      textAlign="center"
    >
      <Text>Copyright © 2025 by Doanh Dinh - Toan Tran {"       "} v2.0.0
      </Text>
    </Box>
  );
};

export default Footer; 
