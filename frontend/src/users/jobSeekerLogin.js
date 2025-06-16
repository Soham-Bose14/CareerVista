import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
  useToast,
  VStack,
  Heading,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import axios from "axios";

const JobSeekerLogin = () => {
  const history = useHistory();
  const [userName, setUserName] = useState("");
  const [jobSeekerPassword, setJobSeekerPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 password toggle state
  const toast = useToast();

  const handleSubmit = async () => {
    const payload = { userName, jobSeekerPassword };
    const config = { headers: { "Content-type": "application/json" } };

    try {
      const { data } = await axios.post("http://localhost:4000/jobSeeker/Authentication", payload, config);
      localStorage.setItem("jobSeekerID", data.jobSeekerID);
      localStorage.setItem("userName", data.userName);
      localStorage.setItem("jobSeekerName", data.jobSeekerName);
      localStorage.setItem("jobSeekerEmail", data.jobSeekerEmail);

      toast({ title: "Logged in successfully.", status: "success", duration: 3000, isClosable: true });
      history.push({ pathname: '/jobSeeker/options' });
    } catch (error) {
      toast({ title: "Login failed.", description: error.response?.data?.message || "Try again.", status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Box bg="gray.50" p={6} borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={4} textAlign="center" color="teal.600">Job Seeker Login</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={jobSeekerPassword}
              onChange={(e) => setJobSeekerPassword(e.target.value)}
            />
            <InputRightElement>
              <Button size="sm" variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button colorScheme="teal" onClick={handleSubmit} width="full">
          Sign In
        </Button>
      </VStack>
    </Box>
  );
};

export default JobSeekerLogin;
