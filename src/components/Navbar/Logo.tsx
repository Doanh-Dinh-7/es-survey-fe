import React from 'react';
import { Link } from "react-router-dom";
import { Text, Image, Flex } from "@chakra-ui/react";
import imgLogo from "../../assets/LogoCompany.png";

const Logo: React.FC<{ }> = () => (
  <Link
    to="/"
    style={{
      textDecoration: "none",
    }}
  >
    <Flex alignItems="center" gap="2">
      <Image src={imgLogo} alt="ES-Survey" width="5vw" height="auto" />
      <Text
        fontSize={{ base: "2xl", lg: "3xl" }}
        fontWeight="bold"
        color="textPrimary"
      >
        ES-Survey
      </Text>
    </Flex>
  </Link>
);

export default Logo; 