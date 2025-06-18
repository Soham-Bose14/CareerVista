const mongoose = require('mongoose');

const jobModel = new mongoose.Schema({
  jobID: { type: String, required: true, unique: true },
  companyID: { type: String, required: true },
  jobDescription: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'fs.files' // Default GridFS files collection
  },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('JobModel', jobModel, 'jobs');
