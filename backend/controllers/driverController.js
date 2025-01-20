const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

// Create a Driver
const createDriver = async (req, res) => {
    try {
        const { name, age, residence} = req.body;
        console.log(req.body)

        // // Ensure vehicle belongs to the agency (optional)
        // if (vehicleId) {
        //     const vehicle = await Vehicle.findById(vehicleId);
        //     if (!vehicle || vehicle.agencyId.toString() !== agencyId) {
        //         return res.status(400).json({ message: "Invalid vehicle assignment" });
        //     }
        // }

        const driver = new Driver({ name, age, residence, agencyId: req.agencyId });
        await driver.save();

        res.status(201).json(driver);
    } catch (err) {
        res.status(500).json({ message: "Error creating driver", error: err.message });
    }
};

// Read all Drivers for an Agency
const getDrivers = async (req, res) => {
  try {
      const drivers = await Driver.find({ agencyId: req.agencyId })
          .populate({
              path: 'vehicleId', // Populate the vehicleId field
              select: 'licensePlate make model location', // Choose fields to include in the response
          });

      res.json(drivers);
  } catch (err) {
      res.status(500).json({ message: "Error fetching drivers", error: err.message });
  }
};


// Update a Driver
const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, residence} = req.body;

        // Ensure vehicle belongs to the agency (optional)
        // if (vehicleId) {
        //     const vehicle = await Vehicle.findById(vehicleId);
        //     if (!vehicle || vehicle.agencyId.toString() !== agencyId) {
        //         return res.status(400).json({ message: "Invalid vehicle assignment" });
        //     }
        // }

        const driver = await Driver.findOneAndUpdate(
            { _id: id, agencyId: req.agencyId },
            { name, age, residence },
            { new: true }
        ).populate({
          path: 'vehicleId', // Populate the vehicleId field
          select: 'licensePlate make model location', // Choose fields to include in the response
      });

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
      const { id } = req.params; // Driver ID
      const { vehicleId } = req.body;

      console.log("recived from driver front: " + vehicleId)

      // Validate vehicle ownership
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle || vehicle.agencyId.toString() !== req.agencyId) {
          return res.status(400).json({ message: "Invalid vehicle assignment" });
      }

      // Update driver with the new vehicle
      const driver = await Driver.findOneAndUpdate(
          { _id: id, agencyId: req.agencyId },
          { vehicleId },
          { new: true } // Return the updated driver
      ).populate('vehicleId'); // Populate the vehicle details

      if (!driver) {
          return res.status(404).json({ message: "Driver not found or unauthorized" });
      }
      console.log(driver)

      res.json(driver); // Include the populated vehicle in the response
  } catch (err) {
      res.status(500).json({ message: "Error associating driver to vehicle", error: err.message });
  }
};


// Delete a Driver
const deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;
        //const { agencyId } = req.body;

        const driver = await Driver.findOneAndDelete({ _id: id, agencyId: req.agencyId });

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
