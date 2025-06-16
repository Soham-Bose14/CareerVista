import React from "react";
import { useHistory } from 'react-router-dom';
import bgImage from "../bgImage.jpg";
import {
  Container,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";

import JobSeekerLogin from "../users/jobSeekerLogin";
import JobSeekerSignUp from "../users/jobSeekerSignUp";

const JobSeeker = () => {
  const history = useHistory();
  const boxWidth = useBreakpointValue({ base: "90%", md: "60%", lg: "40%" });

  const GoHome = () => {
    history.push({ pathname: "/" });
  };

  return (
    <Container
      maxW="100vw"
      minH="100vh"
      centerContent
      p={0}
      m={0}
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPos="center"
    >
      <Box
        bg="whiteAlpha.900"
        p={6}
        borderRadius="xl"
        boxShadow="2xl"
        mt={10}
        w={boxWidth}
        textAlign="center"
      >
        <Heading size="lg" color="blue.600" mb={4}>
          CareerVista: Unlock Your Dream Career
        </Heading>

        <Tabs variant="soft-rounded" colorScheme="blue" isFitted>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <JobSeekerLogin />
            </TabPanel>
            <TabPanel>
              <JobSeekerSignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Button
          mt={6}
          colorScheme="pink"
          variant="outline"
          onClick={GoHome}
        >
          Home
        </Button>
      </Box>
    </Container>
  );
};

export default JobSeeker;
