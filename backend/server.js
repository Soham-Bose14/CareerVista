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
const nodemailer = require('nodemailer');


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

app.post('/jobSeeker/Authentication', async (req, res) => { 
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

app.post('/company/searchCandidates', async (req, res) => {
    try {
        const { companyID, jobID } = req.body;
        console.log(`Received company ID: ${companyID}, job ID: ${jobID}`);

        const job = await Jobs.findOne({ jobID }).exec();
        if (!job) return res.status(404).json({ message: "Job not found" });

        const jdText = job.jobDescription;

        const result = await JobApplication.findOne({ jobID }).exec();
        if (!result) return res.status(404).json({ message: "This job doesn't exist" });

        const fullCandidateData = [];

        for (const id of result.jobSeekerID) {
            const candidate = await JobSeeker.findOne({ id }, {
                _id: 0,
                id: 1,
                username: 1,
                name: 1,
                email: 1,
            }).lean();

            const resumeEntry = await Resume.findOne({ jobSeekerId: id }, {
                _id: 0,
                resumeId: 1,
                fileId: 1,
            }).lean();

            let resumeBase64 = null;

            try {
                if (resumeEntry?.fileId) {
                    const buffer = await getFileBufferFromGridFS(resumeEntry.fileId);
                    resumeBase64 = buffer.toString('base64');
                }
            } catch (err) {
                console.error(`Error retrieving resume for jobSeeker ${id}:`, err.message);
            }

            fullCandidateData.push({
                id: candidate?.id,
                username: candidate?.username,
                name: candidate?.name,
                email: candidate?.email,
                resumeId: resumeEntry?.resumeId || null,
                fileId: resumeEntry?.fileId || null,
                resumeBase64, // this will go to Python and be returned with similarity
            });
        }

        // Create data to send to Python
        const pythonPayload = {
            jdText,
            resumes: fullCandidateData.map(c => ({
                id: c.id,
                resumeBase64: c.resumeBase64 || ''
            })),
        };

        const pythonProcess = spawn('python', ['compute_similarity.py']);
        pythonProcess.stdin.write(JSON.stringify(pythonPayload));
        pythonProcess.stdin.end();

        let output = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Python error:', data.toString());
        });

        pythonProcess.on('close', (code) => {
            try {
                const similarityResults = JSON.parse(output); // [{ id, similarityScore }, ...]

                // Merge similarity into fullCandidateData
                const enrichedCandidates = fullCandidateData.map(candidate => {
                    const scoreEntry = similarityResults.find(s => s.id === candidate.id);
                    return {
                        ...candidate,
                        similarityScore: scoreEntry?.similarityScore || 0
                    };
                });

                // Sort by similarityScore DESC
                enrichedCandidates.sort((a, b) => b.similarityScore - a.similarityScore);

                console.log(`Sending matching job profiles to frontend: `, enrichedCandidates);

                res.json(enrichedCandidates);
            } catch (err) {
                console.error('Failed to parse Python output:', err.message);
                res.status(500).json({ message: 'Invalid output from Python script' });
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
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

// Route: Get job and company details
// GET /jobSeeker/viewApplications?jobSeekerID=1
app.get('/jobSeeker/viewApplications', async (req, res) => {
  try {
    let { jobSeekerID } = req.query;

    console.log("JobSeekerID received by server: ", jobSeekerID);

    if (!jobSeekerID) {
      return res.status(400).json({ message: 'Missing jobSeekerID in query params' });
    }

    jobSeekerID = jobSeekerID.toString();

    const applications = await JobApplication.aggregate([
      {
        $match: {
          jobSeekerID: { $in: [jobSeekerID] }
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobID",
          foreignField: "jobID",
          as: "jobDetails"
        }
      },
      { $unwind: "$jobDetails" },

      // OPTIONAL: Convert to string in case of type mismatch
      {
        $addFields: {
          "jobDetails.companyID": { $toString: "$jobDetails.companyID" }
        }
      },

      {
        $lookup: {
          from: "company",
          localField: "jobDetails.companyID",
          foreignField: "companyID",
          as: "companyDetails"
        }
      },
      { $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: false } },

      {
        $project: {
          _id: 0,
          jobID: 1,
          companyID: "$jobDetails.companyID",
          jobDescription: "$jobDetails.jobDescription",
          companyName: "$companyDetails.companyName"
        }
      }
    ]);


    console.log("✅ Final filtered applications for jobSeekerID:", jobSeekerID, applications);

    return res.json(applications);
  } catch (err) {
    console.error('❌ Final error fetching applications:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


app.delete('/jobSeeker/deleteApplication', async (req, res) => {
  try {
    const { jobID, jobSeekerID } = req.body;

    if (!jobID || !jobSeekerID) {
      return res.status(400).json({ message: 'Missing jobID or jobSeekerID' });
    }

    const result = await JobApplication.updateOne(
      { jobID },
      { $pull: { jobSeekerID: jobSeekerID } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Job application removed for jobSeekerID' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/jobSeeker/viewJobs', async (req, res) => {
    
    try{

        const results = await Jobs.aggregate([
            {
                $lookup: {
                    from: "company",         // the collection to join (check your actual name)
                    localField: "companyID",   // field from Jobs
                    foreignField: "companyID", // field from Company
                    as: "companyDetails"
                }
            },
            {
                $unwind: "$companyDetails" // to flatten the array from lookup
            },
            {
                $project: {
                    _id: 0,
                    jobID: 1,
                    companyID: 1,
                    jobDescription: 1,
                    tags: 1,
                    companyName: "$companyDetails.companyName"
                }
            }
        ]);
        if(results.length === 0){
            return res.status(200).json({ message: "No jobs available." });
        }
        console.log("Jobs being returned to frontend:", results);

        res.status(200).json(results);

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

app.post('/jobSeeker/addApplication', async (req, res) => {
  try {
    let { jobID, jobSeekerID } = req.body;

    console.log("📥 Incoming addApplication request:", { jobID, jobSeekerID });

    jobID = typeof jobID === 'string' ? jobID.trim() : null;
    jobSeekerID = typeof jobSeekerID === 'string' ? jobSeekerID.trim() : null;

    if (!jobID || jobID === "null" || jobID === "undefined" || !jobSeekerID) {
      console.warn("❌ Invalid input received on server:", { jobID, jobSeekerID });
      return res.status(400).json({ message: 'Missing or invalid jobID or jobSeekerID' });
    }

    const application = await JobApplication.findOne({ jobID });

    if (!application) {
      await JobApplication.create({ jobID, jobSeekerID: [jobSeekerID] });
      return res.status(200).json({ message: 'JobSeekerID added successfully' });
    }

    if (application.jobSeekerID.includes(jobSeekerID)) {
      return res.status(200).json({ message: 'JobSeekerID already present' });
    }

    application.jobSeekerID.push(jobSeekerID);
    await application.save();

    return res.status(200).json({ message: 'JobSeekerID added successfully' });
  } catch (error) {
    console.error("❌ Error adding JobSeekerID:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/debug/applications', async (req, res) => {
  const all = await JobApplication.find({});
  res.json(all);
});

app.get('/jobSeeker/debug', async (req, res) => {
  const { jobSeekerID } = req.query;

  const docs = await JobApplication.find({
    jobSeekerID: { $in: [jobSeekerID.toString()] }
  });

  console.log("🧪 Direct match for", jobSeekerID, docs);

  res.json(docs);
});

app.post('/sendEmail', async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create transporter (using Gmail in this example)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'soham14b@gmail.com',       // 🔒 replace with your email
        pass: 'pqqkgpubgbjkwzby'           // 🔒 use an app password if 2FA is enabled
      }
    });

    // Email options
    const mailOptions = {
      from: 'soham14b@gmail.com',
      to: to,
      subject: subject,
      text: message
    };

    // Send mail
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    res.status(200).json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
});

app.get("/", (req, res) => res.send("Welcome to CareerVista."));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
