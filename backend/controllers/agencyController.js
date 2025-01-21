const Agency = require('../models/Agency');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

const registerAgency = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAgency = new Agency({
            name,
            username,
            password: hashedPassword
        });
        await newAgency.save();

        // Create a JWT token
        const token = jwt.sign({ id: newAgency._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token and a message
        res.status(201).json({ message: 'Agency registered successfully', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginAgency = async (req, res) => {
    const { username, password } = req.body;

    try {
        const agency = await Agency.findOne({ username });
        if (!agency) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, agency.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Create a JWT token
        const token = jwt.sign({ id: agency._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAgencyProfile = async (req, res) => {
  console.log("recieved request for profile")
  try {
      // Fetch agency details
      console.log(req.agencyId)
      const agency = await Agency.findById(req.agencyId).select('name username');
      if (!agency) {
          return res.status(404).json({ error: 'Agency not found' });
      }

      // Fetch statistics
      const totalVehicles = await Vehicle.countDocuments({ agencyId: req.agencyId });
      const totalDrivers = await Driver.countDocuments({ agencyId: req.agencyId });
      const assignedDrivers = await Driver.countDocuments({ agencyId: req.agencyId, vehicleId: { $ne: null } });
      const unassignedDrivers = totalDrivers - assignedDrivers;

      console.log("done getting")
      // Response payload
      const response = {
          agency: {
              name: agency.name,
              username: agency.username,
          },
          statistics: {
              totalVehicles,
              totalDrivers,
              assignedDrivers,
              unassignedDrivers,
          },
      };

      console.log(response)

      res.status(200).json(response);
  } catch (error) {
    console.log("I don't know what happened")
      res.status(500).json({ error: error.message });
  }
};

module.exports = {
    registerAgency,
    loginAgency,
    getAgencyProfile
};