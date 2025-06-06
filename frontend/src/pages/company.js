import React from "react";
import { useHistory } from 'react-router-dom';
import bgImage from "../bgImage.jpg"
import {
    Container,
    Box,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Button,
} from "@chakra-ui/react";

import CompanyLogin from "../users/companyLogin";
import CompanySignUp from "../users/companySignUp";

const Company = () => {
    const history = useHistory();


  return <Container maxW='xl' centerContent
    bgImage={`url(${bgImage})`}
    bgSize="cover"
    bgPos="center"
    height="100vh"
    >
        <Box d="flex"
            justifyContent="center"
            p={3}
            bg={"white"}
            w="50%"
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px"
        >
        <h2 fontSize='7xl' fontFamily='Work sans' color='green.600'>Career Vista: A Deep Insight Into Your Resume</h2>
        </Box>
        <Box bg="orange" w="50%" p={4} borderRadius="lg" color="black" borderWidth="1px">
            <Tabs variant="soft-rounded" colorScheme="red">
                <TabList mb="1em">
                    <Tab width="50%">Login</Tab>
                    <Tab width="50%">Sign Up</Tab>
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
        </Box>

    </Container>
};

export default Company;