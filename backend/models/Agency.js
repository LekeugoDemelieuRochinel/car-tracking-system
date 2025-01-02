const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true // Ensure the username is unique
    },
    password: {
        type: String,
        required: true // Store hashed passwords
    },
    vehicles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle', // Reference to the Vehicle model
        default: [] // Default to an empty array
    }]
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

const Agency = mongoose.model('Agency', agencySchema);

module.exports = Agency;