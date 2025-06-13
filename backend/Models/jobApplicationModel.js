const mongoose = require('mongoose');

const jobApplication = new mongoose.Schema({
    jobID: { type: String, required: true, unique: true},
    jobSeekerID: [String],
});

module.exports = mongoose.model('JobApplication', jobApplication, 'jobApplications');
