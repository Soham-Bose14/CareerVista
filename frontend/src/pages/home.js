import React from "react";
import bgImage from "../bgImage.jpg"
import {
    Container,
    Box,
    Text,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";

import Company from "../users/companies";
import UploadResume from "../users/jobSeekers";

const Home = () => {
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
                    <Tab width="50%">Company</Tab>
                    <Tab width="50%">Find Jobs</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Company />
                    </TabPanel>
                    <TabPanel>
                        <UploadResume />
                    </TabPanel>
                </TabPanels>

            </Tabs>
        </Box>
    </Container>
};

export default Home;