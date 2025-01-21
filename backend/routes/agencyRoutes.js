const express = require('express');
const { registerAgency, loginAgency, getAgencyProfile } = require('../controllers/agencyController');
const { authenticate } = require('../controllers/vehicleController');

const router = express.Router();

// POST /register to register a new agency
router.post('/register', registerAgency);

// POST /login to authenticate an agency
router.post('/login', loginAgency);

router.get('/profile', authenticate, getAgencyProfile)

module.exports = router;