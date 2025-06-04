import React, { useState } from "react";
import { InputRightElement, VStack } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { InputGroup } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

// import { useHistory } from "react-router-dom";

const CompanyLogin = () => {
    const history = useHistory();

    const [companyEmail, setCompanyEmail] = useState();
    const [companyPassword, setCompanyPassword] = useState();
    
    const [loading, setLoading] = useState();

    const toast = useToast();

    const submitHandler = async() => {

        const formData = new FormData();

        formData.append("companyEmail", companyEmail);
        formData.append("companyPassword", companyPassword);

        if(!companyEmail || !companyPassword){
            toast({
                title: "Please enter both the email and the password.",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try{
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("http://localhost:4000/companyAuthentication", formData, config);

            console.log("Data during login: ", data);
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

            history.push({
                pathname: "/company/options",
            });


        }catch(error){
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };
    return(<VStack spacing="3px">
            <FormControl id='company_login_email' isRequired>
                <FormLabel>Company Email:</FormLabel>
                <Input placeholder = "Enter your company's email" value={companyEmail} onChange={(e)=>setCompanyEmail(e.target.value)} />
            </FormControl>
    
            <FormControl id='company_login_password' isRequired>
                <FormLabel>Password:</FormLabel>
                <Input placeholder = "Enter password" value={companyPassword} onChange={(e)=>setCompanyPassword(e.target.value)} />
            </FormControl>

            <Button colorScheme="red" color="red" width="50%" style={{ marginTop:15 }} onClick={submitHandler} isLoading={loading}>
                Sign In
            </Button>
            
        </VStack>
    )  
};

export default CompanyLogin;