const mongoose = require('mongoose');

const jobApplication = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true},
    jobSeekerId: [String],
});

module.exports = mongoose.model('JobApplication', jobApplication, 'jobApplications');
