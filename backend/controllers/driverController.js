const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

// Create a Driver
const createDriver = async (req, res) => {
    try {
        const { name, age, residence, agencyId, vehicleId } = req.body;

        // Ensure vehicle belongs to the agency (optional)
        if (vehicleId) {
            const vehicle = await Vehicle.findById(vehicleId);
            if (!vehicle || vehicle.agencyId.toString() !== agencyId) {
                return res.status(400).json({ message: "Invalid vehicle assignment" });
            }
        }

        const driver = new Driver({ name, age, residence, agencyId, vehicleId });
        await driver.save();

        res.status(201).json(driver);
    } catch (err) {
        res.status(500).json({ message: "Error creating driver", error: err.message });
    }
};

// Read all Drivers for an Agency
const getDrivers = async (req, res) => {
    try {
        const { agencyId } = req.body;
        const drivers = await Driver.find({ agencyId });
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ message: "Error fetching drivers", error: err.message });
    }
};

// Update a Driver
const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, residence, vehicleId, agencyId } = req.body;

        // Ensure vehicle belongs to the agency (optional)
        if (vehicleId) {
            const vehicle = await Vehicle.findById(vehicleId);
            if (!vehicle || vehicle.agencyId.toString() !== agencyId) {
                return res.status(400).json({ message: "Invalid vehicle assignment" });
            }
        }

        const driver = await Driver.findOneAndUpdate(
            { _id: id, agencyId },
            { name, age, residence, vehicleId },
            { new: true }
        );

        if (!driver) {
            return res.status(404).json({ message: "Driver not found or unauthorized" });
        }

        res.json(driver);
    } catch (err) {
        res.status(500).json({ message: "Error updating driver", error: err.message });
    }
};

// Associate a Driver to a Vehicle
const associateDriverToVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { vehicleId, agencyId } = req.body;

        // Validate vehicle ownership
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle || vehicle.agencyId.toString() !== agencyId) {
            return res.status(400).json({ message: "Invalid vehicle assignment" });
        }

        // Update driver with the new vehicle
        const driver = await Driver.findOneAndUpdate(
            { _id: id, agencyId },
            { vehicleId },
            { new: true }
        );

        if (!driver) {
            return res.status(404).json({ message: "Driver not found or unauthorized" });
        }

        res.json(driver);
    } catch (err) {
        res.status(500).json({ message: "Error associating driver to vehicle", error: err.message });
    }
};

// Delete a Driver
const deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { agencyId } = req.body;

        const driver = await Driver.findOneAndDelete({ _id: id, agencyId });

        if (!driver) {
            return res.status(404).json({ message: "Driver not found or unauthorized" });
        }

        res.json({ message: "Driver deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting driver", error: err.message });
    }
};

module.exports = {
    createDriver,
    getDrivers,
    updateDriver,
    associateDriverToVehicle,
    deleteDriver
};
