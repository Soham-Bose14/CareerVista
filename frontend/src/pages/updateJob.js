import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useToast } from "@chakra-ui/react";
import {
  Box,
  Heading,
  Button,
  Container,
  Input,
  VStack,
  Text,
} from '@chakra-ui/react';
import axios from "axios";
import bgImage from "../bgImage.jpg";

const UpdateJob = () => {
  const location = useLocation();
  const history = useHistory();
  const toast = useToast();

  const jobID = location.state?.jobID || "";
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);

  const EditHandler = async () => {
    if (!jobDescriptionFile) {
      toast({
        title: "No file selected.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("jobID", jobID);
      formData.append("jobDescriptionFile", jobDescriptionFile);

      await axios.post(
        "http://localhost:4000/company/editJob",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Job updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      history.push({
        pathname: "/company/Options",
      });

    } catch (error) {
      toast({
        title: "Error updating job.",
        description: error.response?.data?.message || "Server error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const CancelHandler = () => {
    history.push({
      pathname: "/company/Options",
    });
  };

  return (
    <Container
      maxW="100vw"
      centerContent
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPos="center"
      minHeight="100vh"
      p={2}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
        bg="white"
        w={{ base: "90%", md: "70%", lg: "50%" }}
        m="30px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Heading as="h2" size="lg" mb={2}>
          CareerVista: The Perfect Portal for Jobs
        </Heading>

        <Text fontWeight="bold" mt={3}>
          Job ID: {jobID}
        </Text>

        <Box mt={3} width="100%">
          <Input
            type="file"
            accept=".doc,.docx,.pdf,.txt"
            onChange={(e) => setJobDescriptionFile(e.target.files[0])}
          />
        </Box>

        <Box display="flex" gap={4} mt={4}>
          <Button colorScheme="teal" onClick={EditHandler}>
            Edit
          </Button>
          <Button colorScheme="gray" onClick={CancelHandler}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdateJob;
