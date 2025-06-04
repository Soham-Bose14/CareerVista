const mongoose = require('mongoose');

const companyModel = new mongoose.Schema({
    companyID: { type: String, required: true, unique: true},
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true, unique: true},
    companyPassword: { type: String, required: true, unique: true},
    address: {
        address1: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pin: { type: String, required: true },
    }
});

module.exports = mongoose.model('Company', companyModel, 'company');