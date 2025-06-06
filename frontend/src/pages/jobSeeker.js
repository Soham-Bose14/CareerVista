import React from "react";
import { useHistory } from 'react-router-dom';
import bgImage from "../bgImage.jpg";
import {
  Container,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
  Heading,
} from "@chakra-ui/react";

import JobSeekerLogin from "../users/jobSeekerLogin";
import JobSeekerSignUp from "../users/jobSeekerSignUp";

const JobSeeker = () => {
  const history = useHistory();

  return (
    <Container
    maxW="100vw"
    p={0}
    m={0}
    bgImage={`url(${bgImage})`}
    bgSize="cover"
    bgPos="center"
    minHeight="100vh"
    >
    <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
    >
        <Heading fontSize="4xl" fontFamily="Work sans" color="green.600">
        Career Vista: A Deep Insight Into Your Resume
        </Heading>
    </Box>

    {/* 🔽 CONTAINED CENTERED SECTION */}
    <Box
        bg="orange"
        w="90%"
        maxW="800px"
        mx="auto"
        p={6}
        borderRadius="lg"
        color="black"
        borderWidth="1px"
    >
        <Tabs variant="soft-rounded" colorScheme="red">
        <TabList mb="1em" display="flex" justifyContent="center">
            <Tab flex={1}>Login</Tab>
            <Tab flex={1}>Sign Up</Tab>
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
    </Box>
    </Container>
  );
};

export default JobSeeker;
