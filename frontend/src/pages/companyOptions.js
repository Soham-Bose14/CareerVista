import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
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

const CompanyOptions = () => {
  const history = useHistory();
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("view");

  const [newJob, setNewJob] = useState({
    jobID: "",
    jobDescription: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const ViewJobs = async () => {
    const companyID = localStorage.getItem("companyID");
    const companyName = localStorage.getItem("companyName");
    const companyEmail = localStorage.getItem("companyEmail");

    const companyData = { companyID, companyName, companyEmail };

    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };
      const response = await axios.post(
        "http://localhost:4000/company/viewJobs",
        companyData,
        config
      );

      const jobData = response.data;

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

  const UpdateJob = async (jobID) => {
    history.push({
      pathname: "/company/updateJob",
      state: { jobID },
    });
  };

  const SearchCandidates = async (jobID) => {
    let companyID;
    try {
      companyID = localStorage.getItem("companyID"); 
    } catch (err) {
      console.error("Couldn't get companyID from localStorage.");
      return;
    }

    try {
      console.log(`Sending companyID to server: ${companyID}, jobID: ${jobID}`);

      const response = await axios.post('http://localhost:4000/company/searchCandidates', {
        companyID,
        jobID,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("HTTP status:", response.status);

      const data = response.data;
      const results = data.results;

      alert(`Similarity scores calculated`);

      console.log("Matching job profiles: ", results);

      history.push({
        pathname: "/company/candidates",
        state: { results: results }
    });

  } catch (error) {
    console.error('Error comparing resume:', error);
    alert('An error occurred while comparing the resume');
  }
};


  const AddJob = async () => {
    const companyID = localStorage.getItem("companyID");
    const jobDetails = { ...newJob, companyID };

    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };
      await axios.post(
        "http://localhost:4000/company/addJob",
        jobDetails,
        config
      );
      toast({
        title: "Job Added Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewJob({ jobID: "", jobDescription: "" });
    } catch (error) {
      toast({
        title: "Error adding job",
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
              View Jobs
            </Button>
            <Button
              colorScheme={activeTab === "add" ? "teal" : "gray"}
              onClick={() => setActiveTab("add")}
            >
              Add New Job
            </Button>
          </Box>
        </Box>

        {/* View Jobs Section */}
        {activeTab === "view" && (
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md" overflowX="auto">
            <Heading size="md" mb={4}>
              Jobs Posted:
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
                {jobs.map((job, index) => (
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
        {activeTab === "add" && (
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>
              Add a New Job
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

export default CompanyOptions;
