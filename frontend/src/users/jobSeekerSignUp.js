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
  const [showPassword, setShowPassword] = useState(false); // 👈 state for toggle
  const [resumeID, setResumeID] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const toast = useToast();

  const submitHandler = async () => {
    if (!jobSeekerID || !userName || !jobSeekerName || !jobSeekerEmail || !jobSeekerPassword || !resumeID || !resumeFile) {
      toast({ title: "Please fill all the details.", status: "warning", duration: 4000, isClosable: true, position: "bottom" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("jobSeekerID", jobSeekerID);
      formData.append("userName", userName);
      formData.append("jobSeekerName", jobSeekerName);
      formData.append("jobSeekerEmail", jobSeekerEmail);
      formData.append("jobSeekerPassword", jobSeekerPassword);
      formData.append("resumeID", resumeID);
      formData.append("myFile", resumeFile);

      const config = { headers: { "Content-Type": "multipart/form-data" } };
      await axios.post("http://localhost:4000/jobSeekerSignUp", formData, config);

      toast({ title: "Registration & Resume Upload Successful", status: "success", duration: 4000, isClosable: true, position: "bottom" });

      localStorage.setItem("jobSeekerID", jobSeekerID);
      localStorage.setItem("userName", userName);
      localStorage.setItem("jobSeekerName", jobSeekerName);
      localStorage.setItem("jobSeekerEmail", jobSeekerEmail);
      localStorage.setItem("resumeID", resumeID);

      history.push({ pathname: "/jobSeeker/options" });
    } catch (error) {
      toast({ title: "Error Occurred!", description: error?.response?.data?.message || "Something went wrong.", status: "error", duration: 4000, isClosable: true, position: "bottom" });
    }
  };

  return (
    <Box width="100%" p={6} bg="gray.50" borderRadius="md" boxShadow="md">
      <Heading textAlign="center" size="md" mb={6} color="blue.600">Job Seeker Sign Up</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Job Seeker ID</FormLabel>
          <Input value={jobSeekerID} onChange={(e) => setJobSeekerID(e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input value={jobSeekerName} onChange={(e) => setJobSeekerName(e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={jobSeekerEmail} onChange={(e) => setJobSeekerEmail(e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              value={jobSeekerPassword}
              onChange={(e) => setJobSeekerPassword(e.target.value)}
            />
            <InputRightElement>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Resume ID</FormLabel>
          <Input value={resumeID} onChange={(e) => setResumeID(e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Upload Resume (PDF, DOC, DOCX, TXT)</FormLabel>
          <Input
            type="file"
            accept=".pdf, .doc, .docx, .txt"
            onChange={(e) => setResumeFile(e.target.files[0])}
            p={1.5}
            border="1px solid #E2E8F0"
            borderRadius="6px"
          />
        </FormControl>

        <Button colorScheme="blue" width="full" onClick={submitHandler}>
          Register
        </Button>
      </VStack>
    </Box>
  );
};

export default JobSeekerSignUp;
