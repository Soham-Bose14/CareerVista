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
  Heading
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CompanySignUp = () => {
  const history = useHistory();
  const [companyID, setCompanyID] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState({ address1: '', city: '', state: '', pin: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submitHandler = async () => {
    const companyData = { companyID, companyName, companyEmail, companyPassword, address };

    if (!companyID || !companyName || !companyEmail || !companyPassword || !address.address1 || !address.city || !address.state || !address.pin) {
      toast({
        title: "Please fill all the details.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post("http://localhost:4000/uploadCompanyDetails", companyData, config);

      localStorage.setItem("companyID", companyID);
      localStorage.setItem("companyName", companyName);
      localStorage.setItem("companyEmail", companyEmail);

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      history.push({ pathname: "/company/options" });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error?.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <Box width="100%" p={6} bg="gray.50" borderRadius="md" boxShadow="md">
      <Heading textAlign="center" size="md" mb={6} color="red.600">Company Sign Up</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl id='company_id' isRequired>
          <FormLabel>Company ID:</FormLabel>
          <Input placeholder="Enter your company's ID" value={companyID} onChange={(e) => setCompanyID(e.target.value)} />
        </FormControl>

        <FormControl id='company_name' isRequired>
          <FormLabel>Company Name:</FormLabel>
          <Input placeholder="Enter your company's name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </FormControl>

        <FormControl id='company_email' isRequired>
          <FormLabel>Company Email:</FormLabel>
          <Input type="email" placeholder="Enter your company's email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
        </FormControl>

        <FormControl id='company_password' isRequired>
          <FormLabel>Password:</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={companyPassword}
              onChange={(e) => setCompanyPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id='address1' isRequired>
          <FormLabel>Address Line 1:</FormLabel>
          <Input placeholder="Enter address" value={address.address1} onChange={(e) => setAddress({ ...address, address1: e.target.value })} />
        </FormControl>

        <FormControl id='city' isRequired>
          <FormLabel>City:</FormLabel>
          <Input placeholder="Enter city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
        </FormControl>

        <FormControl id='state' isRequired>
          <FormLabel>State:</FormLabel>
          <Input placeholder="Enter state" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
        </FormControl>

        <FormControl id='pin' isRequired>
          <FormLabel>PIN Code:</FormLabel>
          <Input placeholder="Enter PIN" value={address.pin} onChange={(e) => setAddress({ ...address, pin: e.target.value })} />
        </FormControl>

        <Button colorScheme="red" width="full" mt={3} onClick={submitHandler} isLoading={loading}>
          Sign Up
        </Button>
      </VStack>
    </Box>
  );
};

export default CompanySignUp;
