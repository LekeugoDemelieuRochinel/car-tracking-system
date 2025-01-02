const express = require('express');
const { registerAgency, loginAgency } = require('../controllers/agencyController');

const router = express.Router();

// POST /register to register a new agency
router.post('/register', registerAgency);

// POST /login to authenticate an agency
router.post('/login', loginAgency);

module.exports = router;