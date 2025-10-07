import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Box,
  Text,
  Button,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";

const MenuBar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const handleLogout = (): void => {
    logout();
  };

  if (!isAuthenticated || !user) return null;

  return (
    <Menu>
      <MenuButton
        as={Button}
        bg="transparent"
        w="auto"
        h="auto"
        p={2}
        rightIcon={<FaChevronDown color="textSecondary" />}
        _hover={{
          bg: "transparent",
          "& .menu-text": {
            color: "primary",
          },
          "& .menu-icon": {
            color: "primary",
          },
        }}
        _active={{
          bg: "transparent",
        }}
      >
        <HStack spacing={3}>
          <Box textAlign="left">
            <Flex align="center">
              <Avatar size="sm" src={user.picture} mr="2" />
              <Box display={{ base: "none", md: "block" }}>
                <Text
                  className="menu-text"
                  fontWeight="bold"
                  color="textPrimary"
                  fontSize="sm"
                  transition="color 0.2s"
                >
                  {user.name}
                </Text>
                <Text
                  className="menu-text"
                  color="textPrimary"
                  fontSize="sm"
                  transition="color 0.2s"
                >
                  {user.email}
                </Text>
              </Box>
            </Flex>
          </Box>
        </HStack>
      </MenuButton>
      <MenuList
        bg="surface"
        borderColor="border"
        boxShadow="0 2px 6px rgba(0,0,0,0.08)"
        borderRadius="12px"
        py={2}
      >
        <MenuItem
          color="error"
          _hover={{
            bg: "error",
            color: "white",
            transform: "translateY(-1px)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          }}
          _active={{
            transform: "translateY(0)",
          }}
          transition="all 0.2s"
          onClick={handleLogout}
        >
          Log out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MenuBar;
