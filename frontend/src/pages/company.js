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

import CompanyLogin from "../users/companyLogin";
import CompanySignUp from "../users/companySignUp";

const Company = () => {
  const history = useHistory();

  const GoHome = () => {
    history.push({ pathname: "/" });
  };

  const boxWidth = useBreakpointValue({ base: "90%", md: "60%", lg: "40%" });

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
        <Heading size="lg" color="teal.600" mb={4}>
          CareerVista: A Deep Insight Into Your Resume
        </Heading>

        <Tabs variant="soft-rounded" colorScheme="teal" isFitted>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <CompanyLogin />
            </TabPanel>
            <TabPanel>
              <CompanySignUp />
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

export default Company;
