// Beautified home.js
import React from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  VStack,
  Container,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import bgImage from "../bgImage.jpg";

const Home = () => {
  const history = useHistory();
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });

  return (
    <Container
      maxW="100vw"
      minH="100vh"
      centerContent
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPos="center"
      p={0}
    >
      <Box
        bg="whiteAlpha.900"
        p={8}
        mt={12}
        borderRadius="xl"
        boxShadow="2xl"
        textAlign="center"
        maxW={{ base: "90%", md: "70%", lg: "50%" }}
      >
        <Heading color="teal.600" size="2xl" mb={4}>
          Welcome to CareerVista
        </Heading>
        <Text fontSize="lg" mb={8}>
          Discover, Apply and Succeed in Your Dream Job
        </Text>

        <VStack spacing={5}>
          <Button
            colorScheme="teal"
            size={buttonSize}
            width="100%"
            onClick={() => history.push("/company")}
          >
            Company Login
          </Button>
          <Button
            colorScheme="blue"
            size={buttonSize}
            width="100%"
            onClick={() => history.push("/jobSeeker")}
          >
            Job Seeker Login
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default Home;
