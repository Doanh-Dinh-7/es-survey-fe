import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, List, ListItem } from "@chakra-ui/react";
import Logo from "./Logo";
import NavLinkItem from "./NavLinkItem";
import NavIndicator from "./NavIndicator";
import MenuBar from "./Menu";
import { paths } from "../../routes/paths";

interface NavLink {
  name: string;
  path: string;
}

interface IndicatorStyle {
  width: number;
  left: number;
}

const Navbar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({ width: 0, left: 0 });
  const menuRef = useRef<HTMLUListElement>(null);
  const location = useLocation();

  const navLinks = useMemo<NavLink[]>(() => {
    return [
      { name: "Home", path: paths.root },
    ];
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const exactMatchIndex = navLinks.findIndex(
      (link) => link.path === currentPath
    );
    if (exactMatchIndex !== -1) return setActiveIndex(exactMatchIndex);

    for (let i = 0; i < navLinks.length; i++) {
      if (
        navLinks[i].path !== paths.root &&
        currentPath.startsWith(navLinks[i].path)
      ) {
        return setActiveIndex(i);
      }
    }
    setActiveIndex(0);
  }, [location.pathname, navLinks]);

  useEffect(() => {
    const update = () => {
      updateIndicator(activeIndex);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeIndex]);

  const updateIndicator = (index: number): void => {
    const items = menuRef.current?.querySelectorAll(".menu-item");
    if (items?.[index]) {
      const element = items[index] as HTMLElement;
      setIndicatorStyle({
        width: element.offsetWidth,
        left: element.offsetLeft,
      });
    }
  };

  return (
    <Flex
      as="nav"
      width="100%"
      maxWidth="1280px"
      margin="0 auto"
      padding="2"
      alignItems="center"
      position="relative"
      zIndex="20"
      gap="5"
    >
      <Logo />
      <List
        ref={menuRef}
        display="flex"
        alignItems="center"
        gap="8"
        position="relative"
        margin="0"
        padding="0"
      >
        {navLinks.map((link, index) => (
          <ListItem key={index} listStyleType="none">
            <NavLinkItem
              to={link.path}
              label={link.name}
              isActive={activeIndex === index}
              isHovered={hoverIndex === index}
              onMouseEnter={() => {
                setHoverIndex(index);
                updateIndicator(index);
              }}
              onMouseLeave={() => {
                setHoverIndex(null);
                updateIndicator(activeIndex);
              }}
              onClick={() => setActiveIndex(index)}
            />
          </ListItem>
        ))}
        <NavIndicator style={indicatorStyle}/>
      </List>
      <Box marginLeft="auto">
        <MenuBar />
      </Box>
    </Flex>
  );
};

export default Navbar; 