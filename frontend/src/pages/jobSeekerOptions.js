import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import bgImage from "../bgImage.jpg";
import {
  Container,
  Box,
  Button,
  Heading,
  Input,
  Textarea,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue
} from "@chakra-ui/react";

const JobSeekerOptions = () => {
    const location = useLocation();
    const history = useHistory();
    let jobData;

    const ApplyForJob = async() => {

    };

    const ViewAppliedJobs = async () => {
        const jobSeekerID = localStorage.getItem("jobSeekerID");
    
        const jobSeekerData = { jobSeekerID };
    
        try {
          const config = {
            headers: { "Content-type": "application/json" },
          };
          const response = await axios.post(
            "http://localhost:4000/company/viewJobs",
            jobSeekerData,
            config
          );
    
          jobData = response.data;
    
          if (jobData?.length > 0) {
            setJobs(jobData);
          } else {
            toast({
              title: "No jobs found",
              status: "info",
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (error) {
          toast({
            title: "Error loading jobs",
            description: error.response?.data?.message || "Server error",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      };

    return (
        <Box
          bgImage={`url(${bgImage})`}
          bgSize="cover"
          bgPos="center"
          minH="100vh"
          py={8}
        >
        <Container maxW="6xl">
            <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="lg"
                textAlign="center"
                mb={6}
            >
                <Heading as="h2" size="xl" mb={4}>
                CareerVista: The Perfect Portal for Jobs
                </Heading>
                <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
                <Button
                    colorScheme={activeTab === "view" ? "teal" : "gray"}
                    onClick={() => {
                    setActiveTab("view");
                    ViewJobs();
                    }}
                >
                    View Job Applications
                </Button>
                <Button
                    colorScheme={activeTab === "apply" ? "teal" : "gray"}
                    onClick={() => setActiveTab("apply")}
                >
                    Apply for Job
                </Button>
                </Box>
            </Box>

            {/* View Jobs Section */}
            {activeTab === "view" && (
                <Box bg="white" p={6} borderRadius="lg" boxShadow="md" overflowX="auto">
                <Heading size="md" mb={4}>
                    Jobs you have applied for:
                </Heading>
                <Table variant="striped" size="md">
                    <Thead>
                    <Tr>
                        <Th>Job ID</Th>
                        <Th>Description</Th>
                        <Th>Update</Th>
                        <Th>Search Candidates</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {jobData.map((job, index) => (
                        <Tr key={index}>
                        <Td>{job.jobID}</Td>
                        <Td>{job.jobDescription}</Td>
                        <Td>
                            <Button
                            colorScheme="teal"
                            size="sm"
                            onClick={() => UpdateJob(job.jobID)}
                            >
                            Update
                            </Button>
                        </Td>
                        <Td>
                            <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => SearchCandidates(job.jobID)}
                            >
                            Search
                            </Button>
                        </Td>
                        </Tr>
                    ))}
                    </Tbody>
                </Table>
                </Box>
            )}

            {/* Add New Job Section */}
            {activeTab === "apply" && (
                <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
                <Heading size="md" mb={4}>
                    Apply for a job
                </Heading>
                <VStack spacing={4}>
                    <Input
                    name="jobID"
                    placeholder="Job ID"
                    value={newJob.jobID}
                    onChange={handleInputChange}
                    />
                    <Textarea
                    name="jobDescription"
                    placeholder="Job Description"
                    value={newJob.jobDescription}
                    onChange={handleInputChange}
                    />
                    <Button colorScheme="teal" onClick={AddJob}>
                    Submit Job
                    </Button>
                </VStack>
                </Box>
            )}
            </Container>
        </Box>
      );
};

export default JobSeekerOptions;