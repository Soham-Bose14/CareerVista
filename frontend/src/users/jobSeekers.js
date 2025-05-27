import React, { useState } from "react";
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


const UploadResume = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const toast = useToast(); 

  const handleChange = (event) => {
    const uploadedFile = event.target.files[0]; 
    setFile(uploadedFile);
    console.log("File uploaded:", uploadedFile);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("myFile", file);
    formData.append("name", name);
    formData.append("email", email);

    try {
      await axios.post("http://localhost:4000/uploadResume", formData);
      toast({
        title: "Resume uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setEmail("");
      setName("");
      setFile(null);
    } catch (error) {
      toast({
        title: "Upload failed",
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
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Upload PDF or Word Document</FormLabel>
        <Input
          type="file"
          accept=".pdf,.doc,.docx, .txt"
          onChange={handleChange}
          p={1}
        />
      </FormControl>

      {file && (
        <Text mb={4}>
          Selected file: <strong>{file.name}</strong>
        </Text>
      )}

      <Button colorScheme="teal" isDisabled={!file || !name || !email} onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default UploadResume;