const mongoose = require('mongoose');

const resumeModel = new mongoose.Schema({
  resumeId: { type: String, required: true, unique: true },
  jobSeekerId: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'uploads.files' }, // reference to GridFS file
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeModel, 'resumeList');
