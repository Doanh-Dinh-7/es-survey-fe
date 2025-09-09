import { Tabs, TabList, Tab, Box } from "@chakra-ui/react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { FC, ReactNode, useState } from "react";

interface EditTabsProps {
  questionTab: ReactNode;
  settingsTab: ReactNode;
  isViewMode?: boolean;
}

const MotionBox = motion.div;

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

const EditTabs: FC<EditTabsProps> = ({
  questionTab,
  settingsTab,
  isViewMode = false,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
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
      <TabList>
        <Tab>Questions</Tab>
        <Tab>Settings</Tab>
      </TabList>

      <div
        style={{ position: "relative", minHeight: "300px", overflow: "hidden" }}
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
              {tabIndex === 0 ? questionTab : settingsTab}
          </MotionBox>
        </AnimatePresence>
      </div>
    </Tabs>
  );
};

export default EditTabs;
