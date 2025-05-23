import React, { useState } from "react";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
  Text,
} from "@chakra-ui/react";


const UploadResume = () => {
    const [email, setEmail] = useState();
    const [name, setName] = useState();
    const [file, setFile] = useState(null);

    const handleChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    console.log("File uploaded:", uploadedFile);
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
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          p={1}
        />
      </FormControl>

      {file && (
        <Text mb={4}>
          Selected file: <strong>{file.name}</strong>
        </Text>
      )}

      <Button colorScheme="teal" isDisabled={!file || !name || !email}>
        Submit
      </Button>
    </Box>
  );
};

export default UploadResume;