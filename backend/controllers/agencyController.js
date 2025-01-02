const Agency = require('../models/Agency');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = {
    registerAgency,
    loginAgency
};