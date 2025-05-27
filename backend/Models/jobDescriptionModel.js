const mongoose = require('mongoose');

const jdModel = new mongoose.Schema({
    companyID: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    jobDescription: { type: String, required: true}
}, { timestamps: true });

module.exports = mongoose.model('JD', jdModel, 'jdList');