const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const agencyRoutes = require('./routes/agencyRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const geofenceRoutes = require('./routes/geofenceRoutes');
const driverRoutes = require('./routes/driverRoutes');
const { simulateVehicleMovements } = require('./controllers/vehicleController'); // Adjust path accordingly

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'http://10.153.121.87:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Create a basic Socket.IO server with CORS configuration
const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});

// Test route
app.get('/', (req, res) => {
    res.send('Car Tracking API is running');
});

// Socket.IO connection
io.on('connection', (socket) => {
   // console.log('A user connected');
    
    // Emit vehicle updates periodically
    setInterval(async () => {
        try {
            const updatedVehicles = await simulateVehicleMovements(io);
            socket.emit('vehicleUpdates', updatedVehicles);
        } catch (error) {
            console.error("Error simulating vehicle movements: ", error);
        }
    }, 5000); // Update every 5 seconds

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Use agency routes
app.use('/api/agencies', agencyRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/geofences', geofenceRoutes);
app.use('/api/drivers/', driverRoutes)

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});