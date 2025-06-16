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
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

const CompanyLogin = () => {
  const history = useHistory();
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submitHandler = async () => {
    const formData = new FormData();
    formData.append("companyEmail", companyEmail);
    formData.append("companyPassword", companyPassword);

    if (!companyEmail || !companyPassword) {
      toast({
        title: "Please enter both the email and the password.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post("http://localhost:4000/companyAuthentication", formData, config);

      localStorage.setItem("companyID", data.companyID);
      localStorage.setItem("companyName", data.companyName);
      localStorage.setItem("companyEmail", data.companyEmail);

      toast({
        title: "Successfully logged in",
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
        description: error.response?.data?.message || "Something went wrong.",
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
      <Heading textAlign="center" size="md" mb={6} color="red.600">Company Login</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl id='company_login_email' isRequired>
          <FormLabel>Company Email:</FormLabel>
          <Input
            placeholder="Enter your company's email"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id='company_login_password' isRequired>
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

        <Button
          colorScheme="red"
          width="full"
          mt={3}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign In
        </Button>
      </VStack>
    </Box>
  );
};

export default CompanyLogin;
