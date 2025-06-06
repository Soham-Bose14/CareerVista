import React from "react";
import { useHistory } from 'react-router-dom';
import bgImage from "../bgImage.jpg"
import {
    Container,
    Box,
    Button,
} from "@chakra-ui/react";


const Home = () => {
    const history = useHistory();

    const GoToCompany = async() => {
        history.push({
            pathname: '/company'
        });
    };

    const GoToJobSeeker = async() => {
        history.push({
            pathname: '/jobSeeker'
        });
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
            <Button colorScheme="red" color="yellow" width="50%" style={{ marginTop:15 }} onClick={GoToCompany}>
                Company
            </Button>
            <Button colorScheme="red" color="yellow" width="50%" style={{ marginTop:15 }} onClick={GoToJobSeeker}>
                Job Seeker
            </Button>
        </Box>

    </Container>
};

export default Home;