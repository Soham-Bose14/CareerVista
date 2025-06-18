import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import bgImage from "../bgImage.jpg";
import Loader from "../components/Loader";
import {
  Container,
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  FormControl,
  FormLabel
} from "@chakra-ui/react";

const CompanyOptions = () => {
  const history = useHistory();
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobDescriptionFile, setJobDescriptionFile] = useState("");
  const [newJob, setNewJob] = useState({ jobID: "", jobDescription: jobDescriptionFile });

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
      const response = await axios.post("http://localhost:4000/company/viewJobs", companyData);
      if (response.data?.length > 0) {
        setJobs(response.data);
      } else {
        toast({ title: "No jobs found", status: "info", duration: 3000, isClosable: true });
      }
    } catch (error) {
      toast({ title: "Error loading jobs", description: error.response?.data?.message || "Server error", status: "error", duration: 3000, isClosable: true });
    }
  };

  const UpdateJob = (jobID) => {
    history.push({ pathname: "/company/updateJob", state: { jobID } });
  };

  const SearchCandidates = async (jobID, jobDescription) => {
    const companyID = localStorage.getItem("companyID");
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/company/searchCandidates', { companyID, jobID });
      toast({ title: "Found suitable candidates for this job.", status: "success", duration: 3000, isClosable: true });
      history.push({ pathname: "/company/candidates", state: { results: response.data, jobDescription } });
    } catch (error) {
      toast({ title: "Error comparing resume", status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  const AddJob = async () => {
    const companyID = localStorage.getItem("companyID");
    const formData = new FormData();
    formData.append("jobID", newJob.jobID);
    formData.append("companyID", companyID);
    formData.append("jobDescription", jobDescriptionFile);

    try {
      await axios.post("http://localhost:4000/company/addJob", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast({ title: "Job Added Successfully", status: "success", duration: 3000, isClosable: true });
      setNewJob({ jobID: "", jobDescription: "" });
      setJobDescriptionFile("");
    } catch (error) {
      toast({ title: "Error adding job", description: error.response?.data?.message || "Server error", status: "error", duration: 3000, isClosable: true });
    }
  };

  const boxWidth = useBreakpointValue({ base: "95%", md: "80%", lg: "70%" });
  if (loading) return <Loader />;

  const GoHome = () => {
    history.push({ pathname: "/" });
  };

  const GoBack = () => {
    history.push({ pathname: "/company" });
  };

  return (
    <Box bgImage={`url(${bgImage})`} bgSize="cover" bgPos="center" minH="100vh" py={8}>
      <Container maxW="8xl">
        <Box bg="whiteAlpha.900" p={6} borderRadius="xl" boxShadow="xl" textAlign="center" mb={6}>
          <Heading as="h2" size="lg" mb={4} color="teal.700">
            CareerVista: The Perfect Portal for Jobs
          </Heading>
          <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
            <Button colorScheme={activeTab === "view" ? "teal" : "gray"} onClick={() => { setActiveTab("view"); ViewJobs(); }}>View Jobs</Button>
            <Button colorScheme={activeTab === "add" ? "teal" : "gray"} onClick={() => setActiveTab("add")}>Add New Job</Button>
          </Box>
        </Box>

        {activeTab === "view" && (
          <Box bg="white" p={6} borderRadius="xl" boxShadow="md" overflowX="auto" w={boxWidth} mx="auto">
            <Heading size="md" mb={4}>Jobs Posted:</Heading>
            <Table variant="striped" size="md">
              <Thead>
                <Tr>
                  <Th>Job ID</Th>
                  <Th>Job Description</Th>
                  <Th>Update</Th>
                  <Th>Search Candidates</Th>
                </Tr>
              </Thead>
              <Tbody>
                {jobs.map((job, index) => (
                  <Tr key={index}>
                    <Td>{job.jobID}</Td>
                    <Td>
                      {job.jobDescription ? (
                        <a
                          href={`http://localhost:4000/download/jobDescription/${job.jobDescription}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" colorScheme="gray">Download</Button>
                        </a>
                      ) : (
                        "Not Available"
                      )}
                    </Td>
                    <Td>
                      <Button colorScheme="teal" size="sm" onClick={() => UpdateJob(job.jobID)}>Update</Button>
                    </Td>
                    <Td>
                      <Button colorScheme="blue" size="sm" onClick={() => SearchCandidates(job.jobID, job.jobDescription)}>Search</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {activeTab === "add" && (
          <Box bg="white" p={6} borderRadius="xl" boxShadow="md" w={boxWidth} mx="auto">
            <Heading size="md" mb={4}>Add a New Job</Heading>
            <VStack spacing={4}>
              <Input name="jobID" placeholder="Job ID" value={newJob.jobID} onChange={handleInputChange} />
              <FormControl isRequired>
                <FormLabel>Upload Job Description (PDF, DOC, DOCX, TXT)</FormLabel>
                <Input
                  type="file"
                  accept=".pdf, .doc, .docx, .txt"
                  onChange={(e) => setJobDescriptionFile(e.target.files[0])}
                  p={1.5}
                  border="1px solid #E2E8F0"
                  borderRadius="6px"
                />
              </FormControl>
              <Button colorScheme="teal" onClick={AddJob}>Submit Job</Button>
            </VStack>
          </Box>
        )}

        <Button mt={6} colorScheme="pink" variant="outline" onClick={GoHome}>Home</Button>
        <Button mt={6} colorScheme="pink" variant="outline" onClick={GoBack}>Back</Button>
      </Container>
    </Box>
  );
};

export default CompanyOptions;
