const mongoose = require('mongoose');

const resumeModel = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'uploads.files' }, // reference to GridFS file
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeModel, 'resumeList');
