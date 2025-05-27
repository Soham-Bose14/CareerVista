const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const { GridFSBucket } = require('mongodb');
const Resume = require('./Models/resumeModel');
const jdModel = require('./Models/jobDescriptionModel');
const { Readable } = require('stream');
const connectDB = require('./config/database');
const fileUpload = require('express-fileupload');

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

app.post('/uploadResume', async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name || !req.files?.myFile) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const file = req.files.myFile;

        const readableStream = new Readable();
        readableStream.push(file.data);
        readableStream.push(null); // Signals end of stream

        const uploadStream = gfsBucket.openUploadStream(file.name, {
            contentType: file.mimetype,
            metadata: { uploadedBy: email }
        });

        readableStream.pipe(uploadStream);

        uploadStream.on('finish', async () => {
            const newResume = await Resume.create({
                email,
                name,
                fileId: uploadStream.id
            });

            res.status(201).json({
                message: 'Resume uploaded successfully',
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

app.post('/uploadJobDescription', async (req, res) => {
    try{
        const { companyID, companyName, jobDescription } = req.body;

        if(!companyID || !companyName || !jobDescription){
            return res.status(400).json({ message: 'Missing required fields!'});
        }
        const newJD = await jdModel.create({
            companyID,
            companyName,
            jobDescription
        });
        
        res.status(201).json({
            message: 'Job Description uploaded successfully',
            data: newJD
        });

    }catch(error){
        console.error('Error uploading job description: ', error);
        res.status(500).json({ message: 'Server error while uploading job description'});
    }
});

app.get("/", (req, res) => res.send("Welcome to CareerVista."));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
