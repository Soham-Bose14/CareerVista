const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const { GridFSBucket } = require('mongodb');
const Resume = require('./Models/resumeModel');
const Jobs = require('./Models/jobModel');
const Company = require('./Models/companyModel');
const JobSeeker = require('./Models/jobSeekerModel');
const JobApplication = require('./Models/jobApplicationModel');
const { Readable } = require('stream');
const connectDB = require('./config/database');
const fileUpload = require('express-fileupload');
const { spawn } = require('child_process');
const { ObjectId } = require('mongodb');


dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(fileUpload());

let gfsBucket;

mongoose.connection.once('open', () => {
    gfsBucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'resumes'
    });
    console.log("GridFSBucket ready.");
});

const getFileBufferFromGridFS = async(fileID) => {
    return new Promise((resolve, reject) => {
        const chunks = [];

        const downloadStream = gfsBucket.openDownloadStream(new ObjectId(fileID));

        downloadStream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        downloadStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        downloadStream.on('error', (err) => {
            reject(err);
        });
    });
};

app.post('/jobSeekerSignUp', async (req, res) => {
  try {
    const {
      jobSeekerID,
      userName,
      jobSeekerName,
      jobSeekerEmail,
      jobSeekerPassword,
      resumeID
    } = req.body;

    // ✅ Check for required fields
    if (!jobSeekerID || !userName || !jobSeekerName || !jobSeekerEmail || !jobSeekerPassword || !resumeID || !req.files || !req.files.myFile) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const file = req.files.myFile;

    // ✅ Create job seeker record first
    const newJobSeeker = await JobSeeker.create({
        id: jobSeekerID,
        username: userName,
        name: jobSeekerName,
        email: jobSeekerEmail,
        password: jobSeekerPassword,
    });


    // ✅ Upload resume to GridFS
    const readableStream = new Readable();
    readableStream.push(file.data);
    readableStream.push(null); // End of stream

    const uploadStream = gfsBucket.openUploadStream(file.name, {
      contentType: file.mimetype,
      metadata: { uploadedBy: jobSeekerEmail }
    });

    readableStream.pipe(uploadStream);

    uploadStream.on('finish', async () => {
      // ✅ Store metadata in Resume collection
    const newResume = await Resume.create({
        resumeId: resumeID,
        jobSeekerId: jobSeekerID,
        fileId: uploadStream.id
    });


      res.status(201).json({
        message: 'Job Seeker and Resume uploaded successfully',
        resume: newResume
      });
    });

    uploadStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).json({ message: 'File upload failed' });
    });

  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/jobSeekerAuthentication', async (req, res) => { 
  try {
    const { userName, jobSeekerPassword } = req.body;

    if (!userName || !jobSeekerPassword) {
      return res.status(400).json({ message: 'Missing one or more required fields!' });
    }

    const user = await JobSeeker.findOne({ username: userName }).exec();

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (user.password === jobSeekerPassword) {
      console.log("Successfully logged in.");
      res.json({
        jobSeekerID: user.id,
        userName: user.username,
        jobSeekerName: user.name,
        jobSeekerEmail: user.email,
        jobSeekerPassword: user.password,
      });
    } else {
      throw new Error("Wrong email or password. Try again.");
    }

  } catch (error) {
    console.log("Error during user authentication: ", error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


app.post('/uploadCompanyDetails', async (req, res) => {
    try{
        const { companyID, companyName, companyEmail, companyPassword, address } = req.body;

        if(!companyID || !companyName || !companyEmail || !companyPassword || !address){
            return res.status(400).json({ message: 'Missing one or more required fields!'});
        }
        const newCompany = await Company.create({
            companyID,
            companyName,
            companyEmail,
            companyPassword,
            address,
        });
        
        res.status(201).json({
            message: 'Your company is added successfully',
            data: newCompany
        });

    }catch(error){
        console.error('Error uploading job description: ', error);
        res.status(500).json({ message: 'Server error while uploading job description'});
    }
});

app.post('/company/searchCandidates', async(req, res) => {
    try{
        const { companyID, jobID } = req.body;
        console.log(`Received company ID: ${companyID}, job ID: ${jobID}`);

        const job = await Jobs.findOne({ jobID }).exec();
        const jdText = job.jobDescription;

        console.log(`Received job description: ${jdText}`);

        const result = await JobApplication.findOne({ jobID }).exec();

        if(!result) return res.status(404).json({ message: "This job doesn't exist" });

        let candidateList = [];

        for(id of result.jobSeekerId){
            const candidate = await JobSeeker.findOne({ id }).exec();
            candidateList.push(candidate);
        }

        console.log("Found JD:", jdText);

        const resumes = await Resume.find({
            jobSeekerId: { $in: candidateList }
        });

        if(!resumes.length){
            return res.status(404).json({ message: 'No resumes found' });
        }

        const resumeData = [];

        for(const resume of resumes){
            try{
                const buffer = await getFileBufferFromGridFS(resume.fileId);

                resumeData.push({
                    resumeBase64: buffer.toString('base64'),
                });
            }catch (err) {
                console.error(`Error retrieving file for resume ID ${resume._id}:`, err);
            }
        }

        const pythonProcess = spawn('python', ['compute_similarity.py']);

        const payLoad = JSON.stringify({
            'jdText': jdText,
            'resumes': resumeData,
        });

        pythonProcess.stdin.write(payLoad);
        pythonProcess.stdin.end();

        let output = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Python error:', data.toString());
        });

        pythonProcess.on('close', (code) => {
            try{
                const results = JSON.parse(output);
                results.sort((a,b) => b.similarityScore - a.similarityScore);
                res.json({ results });
            }catch(err){
                console.error('Failed to parse Python output: ', err);
                res.status(500).json({ message: 'Invalid output from Python script' });
            }
        });

    }
    catch(error){
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/companyAuthentication', async(req, res) => {
    try{
        const { companyEmail, companyPassword } = req.body;

        console.log(`Received company email: ${companyEmail}, company password: ${companyPassword}`);

        const company = await Company.findOne({ companyEmail }).exec();

        if(company.companyPassword === companyPassword){
            console.log("Successfully logged in.");
            res.json({
                companyID: company.companyID,
                companyName: company.companyName,
                companyEmail: company.companyEmail,
            });
        }
        else{
            throw new error("Wrong email or password. Try again.");
        }
    }catch(error){
        console.log("Error during company authentication: ", error);
    }
});

app.post('/company/viewJobs', async(req, res) => {
    const { companyID, companyName, companyEmail } = req.body;

    try{
        const jobs = await Jobs.find({
            companyID: { $eq: companyID }
        });

        // const results = JSON.stringify(jobs);

        res.status(201).json(jobs);
    }catch(error){
        console.log("Error viewing jobs: ", error);
    }

});

app.post('/company/addJob', async(req, res) => {
    try{
        const { jobID, jobDescription, companyID } = req.body;

        console.log(`Job ID received: ${jobID}`);
        console.log(`Job description received: ${jobDescription}`);
        console.log(`Company ID received: ${companyID}`);

        if(!jobID || !jobDescription || !companyID){
            return res.status(400).json({ message: 'Missing one or more required fields!'});
        }
        const newJob = await Jobs.create({
            jobID,
            companyID,
            jobDescription,
        });
        
        res.status(201).json({
            message: 'Your company is added successfully',
            data: newJob
        });

    }catch(error){
        console.error('Error uploading job description: ', error);
        res.status(500).json({ message: 'Server error while uploading job description'});
    }
});

app.post('/company/editJob', async(req, res) => {
    const { jobID, jobDescription } = req.body;

    try{
        await Jobs.updateOne(
            { jobID: jobID },
            { $set: { jobDescription: jobDescription } },
        );
        console.log("Job description updated successfully.")
    }catch(error){
        console.error(`Error while editing job description: ${error}`);
    }

});

app.get("/", (req, res) => res.send("Welcome to CareerVista."));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
