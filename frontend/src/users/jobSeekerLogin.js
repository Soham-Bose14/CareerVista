import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";


const JobSeekerLogin = () => {
  const history = useHistory();
  
  const [userName, setUserName] = useState("");
  const [jobSeekerPassword, setJobSeekerPassword] = useState("");
  
  const toast = useToast(); 

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("userName", userName);
    formData.append("jobSeekerPassword", jobSeekerPassword);

    const config = {
        headers: { "Content-type": "application/json" },
      };

    try {
      await axios.post("http://localhost:4000/jobSeekerAuthentication", formData, config);
      toast({
        title: "Logged in successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      history.push({
        pathname: '/jobSeeker/options'
      });
      
    } catch (error) {
      toast({
        title: "Login failed.",
        description: error.response?.data?.message || "Try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg">
      <FormControl mb={4} isRequired>
        <FormLabel>Username</FormLabel>
        <Input
          placeholder="Enter your username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter your password"
          value={jobSeekerPassword}
          onChange={(e) => setJobSeekerPassword(e.target.value)}
        />
      </FormControl>
      <Button
        colorScheme="teal"
        onClick={handleSubmit}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default JobSeekerLogin;