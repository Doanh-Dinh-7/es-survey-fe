import { Link } from "react-router-dom";
import { Text } from "@chakra-ui/react";

interface NavLinkItemProps {
  to: string;
  label: string;
  isActive: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({
  to,
  label,
  isActive,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => (
  <Link
    to={to}
    style={{
      cursor: "pointer",
      transition: "opacity 0.2s",
      textDecoration: "none",
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
  >
    <Text
      fontSize={{ base: "lg", lg: "xl" }}
      fontWeight={isActive ? "bold" : "normal"}
      color={isActive ? "textPrimary" : "textSecondary"}
      opacity={isActive || isHovered ? 1 : 0.75}
  >
    {label}
    </Text>
  </Link>
);

export default NavLinkItem; 