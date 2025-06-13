import React from 'react';
import bgImage from '../bgImage.jpg';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Button,
    Container
} from '@chakra-ui/react';

const Results = () => {
    const location = useLocation();
    const history = useHistory();
    const results = location.state?.results || [];
    const jobDescription = location.state?.jobDescription || [];
    const companyName = localStorage.getItem("companyName");

    console.log(`Candidate list in results page: `, results);

    const backHandler = () => {
        history.push({
            pathname: "/company/options",
        });
    };

    const SendEmail = async (receiverEmail, candidateName) => {
        try {
            const response = await axios.post('http://localhost:4000/sendEmail', {
                to: receiverEmail,
                subject: 'Shortlisted for interview.',
                message: `Dear ${candidateName},\n\nThis is to inform that you are shortlisted by our company for the following role:\n${jobDescription}\n\nKindly report to the office for the interview on Monday at 9am.\n\n${companyName}\nContact: +91 9560885571`
            });
            console.log('Email sent:', response.data);
        } catch (error) {
            console.error('Error sending email:', error.response?.data || error.message);
        }
    }; 

    return(
        <Container
            maxW="100vw"
            minH="100vh"
            centerContent
            bgImage={`url(${bgImage})`}
            bgSize="cover"
            bgRepeat="no-repeat"
            bgPosition="center"
            p={0}
        >
        <Box p={8} w="100%">
            <Heading mb={4}>Similarity Results</Heading>
            {results.length > 0 ? (
            <Table variant="simple">
                <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>Username</Th>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Similarity Score</Th>
                    <Th>Interview</Th>
                </Tr>
                </Thead>
                <Tbody>
                {results.map((item, index) => (
                    <Tr key={index}>
                    <Td>{item.id}</Td>
                    <Td>{item.username}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.email}</Td>
                    <Td>{item.similarityScore}%</Td>
                    <Td>
                        <Button
                        colorScheme="teal"
                        size="sm"
                        onClick={() => SendEmail(item.email, item.name)}
                        >
                        Send Email
                        </Button>
                    </Td>
                    </Tr>
                ))}
                </Tbody>
            </Table>
            ) : (
            <Text>No results found.</Text>
            )}
        </Box>
        <Button id="back" color="darkcyan" onClick={backHandler}>
            Back
        </Button>
        </Container>
    )
};

export default Results;