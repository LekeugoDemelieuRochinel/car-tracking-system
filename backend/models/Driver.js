const mongoose = require('mongoose');
const vehicle = require('./Vehicle')

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    residence: {
        type: String,
        required: true
    },
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Agency'
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        default: null // A driver can initially be unassigned to a vehicle
    }
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
