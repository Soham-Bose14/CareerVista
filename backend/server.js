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

app.post('/compareResumeToJD', async(req, res) => {
    try{
        const { resumeFileID } = req.body;
        if(!resumeFileID) return res.status(400).json({ message: 'Resume file ID is required' });

        const resumeBuffer = await getFileBufferFromGridFS(resumeFileID);
        const resumeBase64 = resumeBuffer.toString('base64');

        const latestJD = await jdModel.findOne().sort({ createdAt: -1 }).exec();

        if(!latestJD) return res.status(404).json({ message: 'No job description found' });

        const jdText = latestJD.jobDescription;

        const pythonProcess = spawn('python', ['compute_similarity.py']);

        const payLoad = JSON.stringify({
            resumeBase64,
            jdText,
        });

        pythonProcess.stdin.write(payLoad);
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            const similarityScore = parseFloat(data.toString().trim());

            if(isNaN(similarityScore)){
                return res.status(500).json({ message: 'Invalid similarity score from python script' });
            }

            res.json({ similarityScore });
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Python error:', data.toString());
        });

    }
    catch(error){
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get("/", (req, res) => res.send("Welcome to CareerVista."));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
