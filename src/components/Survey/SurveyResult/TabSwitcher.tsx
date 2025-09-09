import { Tabs, TabList, Tab } from "@chakra-ui/react";

interface TabSwitcherProps {
  tabIndex: number;
  setTabIndex: (i: number) => void;
}

const TabSwitcher = ({ tabIndex, setTabIndex }: TabSwitcherProps) => (
  <Tabs index={tabIndex} onChange={setTabIndex} align="center" mb={6}>
    <TabList>
      <Tab>Statistic</Tab>
      <Tab>Detail</Tab>
    </TabList>
  </Tabs>
);

export default TabSwitcher; 