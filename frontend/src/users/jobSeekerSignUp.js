import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
  Box,
  Heading,
  Container,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const JobSeekerSignUp = () => {
  const history = useHistory();

  const [jobSeekerID, setJobSeekerID] = useState("");
  const [userName, setUserName] = useState("");
  const [jobSeekerName, setJobSeekerName] = useState("");
  const [jobSeekerEmail, setJobSeekerEmail] = useState("");
  const [jobSeekerPassword, setJobSeekerPassword] = useState("");
  const [resumeID, setResumeID] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const toast = useToast();

  const submitHandler = async () => {
    if (
      !jobSeekerID ||
      !userName ||
      !jobSeekerName ||
      !jobSeekerEmail ||
      !jobSeekerPassword ||
      !resumeID ||
      !resumeFile
    ) {
      toast({
        title: "Please fill all the details.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log("Resume file:", resumeFile);


    try {
      const formData = new FormData();
      formData.append("jobSeekerID", jobSeekerID);
      formData.append("userName", userName);
      formData.append("jobSeekerName", jobSeekerName);
      formData.append("jobSeekerEmail", jobSeekerEmail);
      formData.append("jobSeekerPassword", jobSeekerPassword);
      formData.append("resumeID", resumeID);
      formData.append("myFile", resumeFile);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        "http://localhost:4000/jobSeekerSignUp",
        formData,
        config
      );

      toast({
        title: "Registration & Resume Upload Successful",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });

      console.log("JobSeekerID received: ", jobSeekerID);

      localStorage.setItem("jobSeekerID", jobSeekerID);
      localStorage.setItem("userName", userName);
      localStorage.setItem("jobSeekerName", jobSeekerName);
      localStorage.setItem("jobSeekerEmail", jobSeekerEmail);
      localStorage.setItem("resumeID", resumeID);

      history.push({
        pathname: "/jobSeeker/options",
      });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error?.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return(
    <Container maxW="container.md" centerContent py={10}>
    <Box width="100%" p={6} bg="gray.50" borderRadius="md" boxShadow="md">
        <Heading textAlign="center" mb={6}>Job Seeker Sign Up</Heading>

        <VStack spacing={5} width="100%" align="stretch">
        <FormControl id="jobSeekerID" isRequired>
            <FormLabel>Job Seeker ID</FormLabel>
            <Input value={jobSeekerID} onChange={(e) => setJobSeekerID(e.target.value)} />
        </FormControl>

        <FormControl id="userName" isRequired>
            <FormLabel>Username</FormLabel>
            <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
        </FormControl>

        <FormControl id="jobSeekerName" isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input value={jobSeekerName} onChange={(e) => setJobSeekerName(e.target.value)} />
        </FormControl>

        <FormControl id="jobSeekerEmail" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
            type="email"
            value={jobSeekerEmail}
            onChange={(e) => setJobSeekerEmail(e.target.value)}
            />
        </FormControl>

        <FormControl id="jobSeekerPassword" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input
                type="password"
                value={jobSeekerPassword}
                onChange={(e) => setJobSeekerPassword(e.target.value)}
            />
            <InputRightElement>
                <Button size="sm" onClick={() => alert("Add password visibility toggle if needed")}>
                Show
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="resumeID" isRequired>
            <FormLabel>Resume ID</FormLabel>
            <Input value={resumeID} onChange={(e) => setResumeID(e.target.value)} />
        </FormControl>

        <FormControl id="resumeFile" isRequired>
            <FormLabel>Upload Resume (PDF, DOC, DOCX, TXT)</FormLabel>
            <input
                type="file"
                accept=".pdf, .doc, .docx, .txt"
                onChange={(e) => setResumeFile(e.target.files[0])}
                style={{ padding: "8px", border: "1px solid #E2E8F0", borderRadius: "6px" }}
            />
        </FormControl>


        <Button colorScheme="blue" width="30%" onClick={submitHandler}>
            Register
        </Button>
        </VStack>
    </Box>
    </Container>

  );
  
};

export default JobSeekerSignUp;
