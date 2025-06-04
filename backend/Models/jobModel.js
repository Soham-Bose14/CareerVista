const mongoose = require('mongoose');

const jobModel = new mongoose.Schema({
    jobID: { type: String, required: true, unique: true },
    companyID: { type: String, required: true },
    jobDescription: { type: String, required: true},
    tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('JobModel', jobModel, 'jobs');