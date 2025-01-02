const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db'); // Adjusted path
const Agency = require('./models/Agency');
const Vehicle = require('./models/Vehicle');


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

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Test route to create an agency
app.post('/api/agencies', async (req, res) => {
  try {
      const newAgency = new Agency(req.body);
      //await newAgency.save();
      res.status(201).json(newAgency);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Test route to create a vehicle
app.post('/api/vehicles', async (req, res) => {
  console.log("recieved request")
  try {
      const newVehicle = new Vehicle(req.body);
      //await newVehicle.save();
      res.status(201).json(newVehicle);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});