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
    Button,
} from "@chakra-ui/react";

import Company from "../users/companies";
import UploadResume from "../users/jobSeekers";

const Home = () => {

    const compareResumeToJD = async() => {
        const resumeFileID = document.getElementById('resumeFileID').value;
        try{
            const response = await fetch('http://localhost:4000/compareResumeToJD', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ resumeFileID }),
            });

            if(!response.ok){
                throw new Error('Failed to fetch similarity score');
            }
            const data = await response.json();
            alert(`Similarity score: ${(data.similarityScore*100)}%`);
        }
        catch(error){
            console.error('Error comparing resume:', error);
            alert('An error occurred while comparing the resume');
        }
    };

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
                <input type="text" id="resumeFileID" placeholder="Enter Resume File ID" />
            <Button colorScheme="teal" onClick={compareResumeToJD}>
                Find Similarity
            </Button>
        </Box>

    </Container>
};

export default Home;