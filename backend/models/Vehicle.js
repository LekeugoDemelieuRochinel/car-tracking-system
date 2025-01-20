const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required: true,
        unique: true // Ensure the license plate is unique
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Agency' 
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        default: null // A driver can initially be unassigned to a vehicle
    }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;