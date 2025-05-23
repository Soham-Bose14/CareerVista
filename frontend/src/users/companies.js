import React, { useState } from "react";
import { InputRightElement, VStack } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { InputGroup } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

// import { useHistory } from "react-router-dom";

const Company = () => {
    const [companyID, setCompanyID] = useState();
    const [companyName, setCompanyName] = useState();
    const [jobDescription, setJobDescription] = useState();
    const [loading, setLoading] = useState();

    const toast = useToast();
    // const history = useHistory();

    const submitHandler = async() => {
        if(!companyID || !companyName || !jobDescription){
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
            const { data } = await axios.post("/jobDescription", { companyID, companyName, jobDescription }, config);

            toast({
                title: "Registration Successful",
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("companyInfo", JSON.stringify(data));
            setLoading(false);

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

            <FormControl id='jd' isRequired>
                <FormLabel>Job Description:</FormLabel>
                <Input placeholder = "Enter job description" value={jobDescription} onChange={(e)=>setJobDescription(e.target.value)} />
            </FormControl>
    
            
    
            <Button colorScheme="red" color="red" width="50%" style={{ marginTop:15 }} onClick={submitHandler} isLoading={loading}>
                Submit
            </Button>
            
            
        </VStack>
    )  
};

export default Company;