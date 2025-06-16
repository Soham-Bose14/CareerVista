import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import bgImage from "../bgImage.jpg";
import {
  Container,
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from "@chakra-ui/react";

const JobSeekerOptions = () => {
  const toast = useToast();
  const location = useLocation();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState("");

  const [jobs, setJobs] = useState([]);
  const [applicationData, setApplicationData] = useState([]);

  const ViewJobApplications = async () => {
    const jobSeekerID = localStorage.getItem("jobSeekerID");

    console.log(`JobSeekerID in local storage: ${jobSeekerID}`)

    if (!jobSeekerID) return;

    try {
      const response = await axios.get(
        `http://localhost:4000/jobSeeker/viewApplications`,
        {
          params: { jobSeekerID },
          headers: { "Content-type": "application/json" },
        }
      );


      if (!(response.data.length > 0)) {
        throw new Error("No applications found!");
      }

      setApplicationData(response.data);

      toast({
        title: "Found previous job applications.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "You didn't apply for any jobs yet.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const DeleteJobApplication = async (jobID) => {
    const jobSeekerID = localStorage.getItem("jobSeekerID");
    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };
      await axios.delete(
        "http://localhost:4000/jobSeeker/deleteApplication",
        {
          data: { jobID, jobSeekerID },
          ...config,
        }
      );

      setApplicationData(prev =>
        prev.filter((job) => job.jobID !== jobID)
      );

      toast({
        title: "Deletion successful.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete application.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const ShowJobs = async () => {
    try {
      const response = await axios.get("http://localhost:4000/jobSeeker/viewJobs");

      if (response.data.length === 0) {
        throw new Error("No jobs found!");
      }
      console.log("Jobs from backend:", response.data);

      setJobs(response.data);

      toast({
        title: "Fetched jobs.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "No jobs available!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const Apply = async (jobID) => {
    const jobSeekerID = localStorage.getItem("jobSeekerID");

    console.log("🔥 APPLY button clicked with:", { jobID, jobSeekerID });

    if (!jobSeekerID || !jobID || jobID === "null" || jobID === "undefined") {
      console.warn("❌ Invalid job or user ID (caught in Apply):", { jobID, jobSeekerID });
      toast({
        title: "Invalid job or user ID.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };

      const response = await axios.post(
        "http://localhost:4000/jobSeeker/addApplication",
        { jobID, jobSeekerID },
        config
      );

      console.log("✅ Backend response:", response.data);

      const msg = response.data.message;

      if (msg === "JobSeekerID added successfully") {
        toast({
          title: "Application submitted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else if (msg.includes("already present")) {
        toast({
          title: "You've already applied for this job.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Couldn't apply for this job!");
      }
    } catch (error) {
      console.error("❌ Apply error:", error);
      toast({
        title: "Couldn't apply for this job!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const GoHome = () => {
    history.push({ pathname: "/" });
  };

  const GoBack = () => {
    history.push({ pathname: "/jobSeeker" });
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
                ViewJobApplications();
              }}
            >
              View Job Applications
            </Button>
            <Button
              colorScheme={activeTab === "apply" ? "teal" : "gray"}
              onClick={() => {
                setActiveTab("apply");
                ShowJobs();
              }}
            >
              Apply for Job
            </Button>
          </Box>
        </Box>

        {activeTab === "view" && (
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md" overflowX="auto">
            <Heading size="md" mb={4}>
              Jobs you have applied for:
            </Heading>
            <Table variant="striped" size="md">
              <Thead>
                <Tr>
                  <Th>Job ID</Th>
                  <Th>Company ID</Th>
                  <Th>Company Name</Th>
                  <Th>Description</Th>
                  <Th>Delete Application</Th>
                </Tr>
              </Thead>
              <Tbody>
                {applicationData.map((job, index) => (
                  <Tr key={index}>
                    <Td>{job.jobID}</Td>
                    <Td>{job.companyID}</Td>
                    <Td>{job.companyName}</Td>
                    <Td>{job.jobDescription}</Td>
                    <Td>
                      <Button
                        colorScheme="teal"
                        size="sm"
                        onClick={() => DeleteJobApplication(job.jobID)}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {activeTab === "apply" && (
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>
              Browse jobs
            </Heading>
            <Table variant="striped" size="md">
              <Thead>
                <Tr>
                  <Th>Job ID</Th>
                  <Th>Company ID</Th>
                  <Th>Company Name</Th>
                  <Th>Job Description</Th>
                  <Th>Tags</Th>
                  <Th>Apply</Th>
                </Tr>
              </Thead>
              <Tbody>
                {jobs.map((job, index) => (
                  <Tr key={index}>
                    <Td>{job.jobID}</Td>
                    <Td>{job.companyID}</Td>
                    <Td>{job.companyName}</Td>
                    <Td>{job.jobDescription}</Td>
                    <Td>{job.tags || "—"}</Td>
                    <Td>
                      <Button
                        colorScheme="teal"
                        size="sm"
                        onClick={() => {
                          if (!job.jobID) {
                            console.warn("❌ Cannot apply — jobID is missing!", job);
                            toast({
                              title: "Invalid job ID. Please refresh the page.",
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                            });
                            return;
                          }
                          Apply(job.jobID);
                        }}
                      >
                        Apply
                      </Button>

                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
        <Button
          mt={6}
          colorScheme="pink"
          variant="outline"
          onClick={GoHome}
        >
          Home
        </Button>
        <Button
          mt={6}
          colorScheme="pink"
          variant="outline"
          onClick={GoBack}
        >
          Back
        </Button>
      </Container>
    </Box>
  );
};

export default JobSeekerOptions;