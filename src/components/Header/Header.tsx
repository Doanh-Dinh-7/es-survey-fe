import { forwardRef, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "../Navbar/Navbar";

interface HeaderProps {}

const Header = forwardRef<HTMLDivElement, HeaderProps>((_, ref) => {
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      setPrevScrollPos(currentScrollPos);
      setVisible(isVisible);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <Box
      ref={ref}
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      width="100%"
      zIndex="50"
      padding="2"
      bg="white"
      transition="transform 0.3s ease-in-out"
      transform={visible ? "translateY(0)" : "translateY(-100%)"}
    >
      <Navbar />
    </Box>
  );
});

Header.displayName = 'Header';

export default Header; 