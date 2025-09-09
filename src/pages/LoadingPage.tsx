import { Box, Image as ChakraImage, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import LoadingLogo from "../assets/LoadingLogo.png";

const MotionImage = motion(ChakraImage);
const MotionBox = motion(Box);
const MotionText = motion(Text);

const LoadingPage: React.FC = () => {
  return (
    <MotionBox
      key="loading-box"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      flexDirection="column"
    >
      <MotionImage
        src={LoadingLogo}
        alt="Loading"
        boxSize="150px"
        animate={{
          rotate: [0, 180, 360],
          scale: [0.8, 1.2, 0.8],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.5, 1],
        }}
      />

      <MotionText
        mt={4}
        fontSize="xl"
        fontWeight="medium"
        color="white"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        Loading ...
      </MotionText>
    </MotionBox>
  );
};

export default LoadingPage;
