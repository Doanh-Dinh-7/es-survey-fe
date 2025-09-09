import { Box, BoxProps } from "@chakra-ui/react";

interface NavIndicatorProps {
  style?: React.CSSProperties;
}

const NavIndicator: React.FC<NavIndicatorProps> = ({ style }) => (
  <Box
    position="absolute"
    bottom="0"
    display="flex"
    alignItems="center"
    height="2px"
    transition="all 0.3s ease-in-out"
    style={style}
  >
    <Box
      bg="primary"
      height="100%"
      flexGrow={1}
      borderRadius="full"
      marginTop="5px"
    />
    <Box
      bg="primary"
      height="100%"
      width="4px"
      marginLeft="2px"
      borderRadius="full"
      marginTop="5px"
    />
  </Box>
);

export default NavIndicator; 