import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FC, useState } from "react";

const MotionBox = motion.div;

interface TabSwitcherWithAnimationProps {
  tabIndex: number;
  setTabIndex: (index: number) => void;
  children: React.ReactNode;
}

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: "absolute",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    position: "absolute",
  }),
};

const TabSwitcherWithAnimation: FC<TabSwitcherWithAnimationProps> = ({
  tabIndex,
  setTabIndex,
  children,
}) => {
  const [direction, setDirection] = useState(1);

  const handleTabChange = (index: number) => {
    if (index !== tabIndex) {
      setDirection(index > tabIndex ? 1 : -1);
      setTabIndex(index);
    }
  };

  return (
    <Tabs
      variant="enclosed"
      colorScheme="teal"
      index={tabIndex}
      onChange={handleTabChange}
    >
      <TabList mb={5} justifyContent="center">
        <Tab>Statistics</Tab>
        <Tab>Details</Tab>
      </TabList>

      <div
        style={{
          position: "relative",
          minHeight: "300px",
          overflow: "hidden",
        }}
      >
        <AnimatePresence custom={direction} mode="sync">
          <MotionBox
            key={tabIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ width: "100%", padding: "0 1.2vw" }}
          >
            {children}
          </MotionBox>
        </AnimatePresence>
      </div>
    </Tabs>
  );
};

export default TabSwitcherWithAnimation;
