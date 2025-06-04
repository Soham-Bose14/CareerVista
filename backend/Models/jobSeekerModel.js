const mongoose = require('mongoose');

const JobSeeker = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('JobSeeker', JobSeeker, 'jobSeekers');
