import React from 'react';
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
    const { results } = location.state || { results: [] };

    const backHandler = () => {
        history.push({
            pathname: "/",
        });
    };

    return(
        <Container maxw='xl' centerContent
        bgSize="cover"
        bgPos="center"
        height="100vh"
        >
            <Box p={8}>
                <Heading mb={4}>Similarity Results</Heading>
                {results.length > 0 ? (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Similarity Score</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {results.map((item, index) => (
                                <Tr key={index}>
                                    <Td>{item.name || `Candidate ${index + 1}`}</Td>
                                    <Td>{item.email}</Td>
                                    <Td>{item.similarityScore}%</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                ): (<Text>No results found.</Text>)}
            </Box>
            <Button id='back' color='darkcyan' onClick={backHandler}>Back</Button>
        </Container>
        
    );
};

export default Results;