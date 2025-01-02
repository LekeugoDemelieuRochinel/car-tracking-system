const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Agency = require('./models/Agency');
const Vehicle = require('./models/Vehicle');
const agencyRoutes = require('./routes/agencyRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes'); // Import vehicle routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Create a basic Socket.IO server
const server = http.createServer(app);
const io = new Server(server);

// Test route
app.get('/', (req, res) => {
    res.send('Car Tracking API is running');
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Use agency routes
app.use('/api/agencies', agencyRoutes); // Register the agency routes

// Use vehicle routes
app.use('/api/vehicles', vehicleRoutes); // Register the vehicle routes

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});