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
} from "@chakra-ui/react";

const CompanyOptions = () => {
  const history = useHistory();
  const toast = useToast();

  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("view"); // "view" or "add"

  // New Job Form State
    const [newJob, setNewJob] = useState({
        jobID: "",
        jobDescription: "",  // Correct field name
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
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.post(
        "http://localhost:4000/company/viewJobs",
        companyData,
        config
      );
      const jobData = response.data;

      if (jobData && jobData.length > 0) {
        setJobs(jobData);
        toast({
          title: "Jobs loaded",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
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

  const AddJob = async () => {
  const companyID = localStorage.getItem("companyID");
  const jobDetails = { ...newJob, companyID };

  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await axios.post(
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
    setNewJob({ jobID: "", jobDescription: "" }); // Clear form
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
    <Container
      maxW="xl"
      centerContent
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPos="center"
      minHeight="100vh"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={3}
        bg="white"
        w="50%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Heading as="h2" size="xl" mb={2}>
          CareerVista: The Perfect Portal for Jobs
        </Heading>
        <Box display="flex" gap={4} mt={4}>
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

      {/* View Jobs UI */}
      {activeTab === "view" && (
        <Box
          mt={4}
          bg="white"
          p={4}
          borderRadius="md"
          boxShadow="md"
          w="50%"
          maxHeight="300px"
          overflowY="auto"
        >
          <Heading size="md" mb={2}>
            Jobs Posted:
          </Heading>
          {jobs.map((job, index) => (
            <Box key={index} p={2} borderBottom="1px solid #ccc">
              <strong>Job ID:</strong> {job.jobID} <br />
              <strong>ID:</strong> {job.jobID} <br />
              <strong>Description:</strong> {job.jobDescription}
            </Box>
          ))}
        </Box>
      )}

      {/* Add Job Form UI */}
      {activeTab === "add" && (
        <Box
          mt={4}
          bg="white"
          p={4}
          borderRadius="md"
          boxShadow="md"
          w="50%"
        >
          <Heading size="md" mb={4}>
            Add a New Job
          </Heading>
          <VStack spacing={3}>
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
  );
};

export default CompanyOptions;
