const mongoose = require('mongoose');

const geofenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    boundaries: {
        north: Number,
        south: Number,
        east: Number,
        west: Number
    },
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Agency'
    }
}, { timestamps: true });

const Geofence = mongoose.model('Geofence', geofenceSchema);

module.exports = Geofence;