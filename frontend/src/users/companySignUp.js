import React, { useState } from "react";
import { InputRightElement, VStack } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { InputGroup } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

// import { useHistory } from "react-router-dom";

const CompanySignUp = () => {
    const history = useHistory();

    const [companyID, setCompanyID] = useState();
    const [companyName, setCompanyName] = useState();
    const [companyEmail, setCompanyEmail] = useState();
    const [companyPassword, setCompanyPassword] = useState();
    const [address, setAddress] = useState({
        address1: '',
        city: '',
        state: '',
        pin: ''
    });

    
    const [loading, setLoading] = useState();

    const toast = useToast();

    const submitHandler = async() => {

        const companyData = {
            companyID,
            companyName,
            companyEmail,
            companyPassword,
            address,
        };

        if(!companyID || !companyName || !companyEmail || !address || !companyPassword){
            toast({
                title: "Please fill all the details.",
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
            const { data } = await axios.post("http://localhost:4000/uploadCompanyDetails", companyData, config);

            localStorage.setItem("companyID", data.companyID);
            localStorage.setItem("companyName", data.companyName);
            localStorage.setItem("companyEmail", data.companyEmail);

            toast({
                title: "Registration Successful",
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
            <FormControl id='company_id' isRequired>
                <FormLabel>Company ID:</FormLabel>
                <Input placeholder = "Enter your company's id" onChange={(e)=>setCompanyID(e.target.value)} />
            </FormControl>
    
            <FormControl id='company_name' isRequired>
                <FormLabel>Company Name:</FormLabel>
                <Input placeholder = "Enter your company's name" value={companyName} onChange={(e)=>setCompanyName(e.target.value)} />
            </FormControl>

            <FormControl id='company_email' isRequired>
                <FormLabel>Company Email:</FormLabel>
                <Input placeholder = "Enter your company's email" value={companyEmail} onChange={(e)=>setCompanyEmail(e.target.value)} />
            </FormControl>
    
            <FormControl id='company_password' isRequired>
                <FormLabel>Password:</FormLabel>
                <Input type="password" placeholder = "Enter password" value={companyPassword} onChange={(e)=>setCompanyPassword(e.target.value)} />
            </FormControl>

            <FormControl id='address1' isRequired>
                <FormLabel>Address1:</FormLabel>
                <Input placeholder = "Enter address1" value={address.address1} onChange={(e)=>setAddress({...address, address1: e.target.value})} />
            </FormControl>

            <FormControl id='city' isRequired>
                <FormLabel>City:</FormLabel>
                <Input placeholder = "Enter city" value={address.city} onChange={(e)=>setAddress({ ...address, city: e.target.value })} />
            </FormControl>

            <FormControl id='state' isRequired>
                <FormLabel>State:</FormLabel>
                <Input placeholder = "Enter state" value={address.state} onChange={(e)=>setAddress({...address, state: e.target.value})} />
            </FormControl>

            <FormControl id='pin' isRequired>
                <FormLabel>PIN:</FormLabel>
                <Input placeholder = "Enter PIN" value={address.pin} onChange={(e)=>setAddress({...address, pin: e.target.value})} />
            </FormControl>
    
            <Button colorScheme="red" color="red" width="50%" style={{ marginTop:15 }} onClick={submitHandler} isLoading={loading}>
                Sign Up
            </Button>
            
        </VStack>
    )  
};

export default CompanySignUp;