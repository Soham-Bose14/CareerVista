import React, { useEffect, useState } from 'react';
import bgImage from '../bgImage.jpg';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import Loader from './Loader';
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
  Container,
  useBreakpointValue,
  Flex,
  Stack
} from '@chakra-ui/react';

const Results = () => {
  const location = useLocation();
  const history = useHistory();
  const results = location.state?.results || [];
  const jobDescription = location.state?.jobDescription || '';
  const companyName = localStorage.getItem("companyName");
  const toast = useToast();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const backHandler = () => {
    history.push({ pathname: "/company/options" });
  };

  const SendEmail = async (receiverEmail, candidateName) => {
    try {
      const response = await axios.post('http://localhost:4000/sendEmail', {
        to: receiverEmail,
        subject: 'Shortlisted for interview.',
        message: `Dear ${candidateName},\n\nThis is to inform that you are shortlisted by our company for the given role.\n\nKindly report to the office for the interview on Monday at 9am.\n\n${companyName}\nContact: +91 9560885571`
      });
      console.log('Email sent:', response.data);
      toast({
        title: "Email was sent to this candidate.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error sending email:', error.response?.data || error.message);
    }
  };

  const tableWidth = useBreakpointValue({ base: "95%", md: "85%", lg: "80%" });

  return (
    <Container
      maxW="100vw"
      minH="100vh"
      centerContent
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center"
      py={8}
    >
      <Box
        w={tableWidth}
        bg="whiteAlpha.900"
        p={6}
        borderRadius="lg"
        boxShadow="2xl"
        minH="80vh"
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            <Heading mb={6} color="teal.700" textAlign="center">
              Matching Candidates
            </Heading>

            {results.length > 0 ? (
              <Box overflowX="auto">
                <Table variant="simple" colorScheme="teal" size="md">
                  <Thead bg="teal.100">
                    <Tr>
                      <Th>ID</Th>
                      <Th>Username</Th>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Similarity</Th>
                      <Th>Interview</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {results.map((item, index) => (
                      <Tr key={index} _hover={{ bg: "gray.100" }}>
                        <Td>{item.id}</Td>
                        <Td>{item.username}</Td>
                        <Td>{item.name}</Td>
                        <Td>{item.email}</Td>
                        <Td fontWeight="bold" color={item.similarityScore >= 75 ? "green.600" : "orange.500"}>
                          {item.similarityScore}%
                        </Td>
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
              </Box>
            ) : (
              <Text textAlign="center" fontSize="lg" fontWeight="semibold" color="gray.600">
                No results found.
              </Text>
            )}

            <Flex justifyContent="center" mt={8}>
              <Button
                id="back"
                colorScheme="pink"
                variant="outline"
                onClick={backHandler}
                _hover={{ bg: "pink.100" }}
              >
                Back
              </Button>
            </Flex>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Results;
