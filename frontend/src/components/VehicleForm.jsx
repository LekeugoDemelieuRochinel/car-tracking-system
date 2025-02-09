import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import "./vehiclestyle.css";

const API_BASE_URL = "http://localhost:5000/api"; // Replace with your backend URL
const GEOCODING_API_URL = "https://nominatim.openstreetmap.org";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [newVehicleData, setNewVehicleData] = useState({
    licensePlate: "",
    make: "",
    model: "",
    address: "",
  });

  const [editFormData, setEditFormData] = useState({
    licensePlate: "",
    make: "",
    model: "",
  });

  useEffect(() => {
    fetchVehicles();
    const socket = io(API_BASE_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("Connected to Socket.IO server"));

    socket.on("vehiclePositionUpdate", async (updatedVehicle) => {
      const newAddress = await getHumanReadableAddress(
        updatedVehicle.location.latitude,
        updatedVehicle.location.longitude
      );
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle._id === updatedVehicle._id
            ? { ...updatedVehicle, address: newAddress }
            : vehicle
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const vehiclesWithAddress = await Promise.all(
        response.data.map(async (vehicle) => ({
          ...vehicle,
          address: await getHumanReadableAddress(
            vehicle.location.latitude,
            vehicle.location.longitude
          ),
        }))
      );
      setVehicles(vehiclesWithAddress);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch vehicles!");
      setLoading(false);
    }
  };

  const getHumanReadableAddress = async (lat, lon) => {
    try {
      const response = await axios.get(`${GEOCODING_API_URL}/reverse`, {
        params: { lat, lon, format: "json" },
      });
      return response.data.display_name || "Unknown Location";
    } catch (err) {
      console.error("Failed to fetch address:", err);
      return "Unknown Location";
    }
  };

  const getCoordinatesFromAddress = async (address) => {
    try {
      const response = await axios.get(`${GEOCODING_API_URL}/search`, {
        params: { q: address, format: "json", limit: 1 },
      });
      if (response.data.length === 0) throw new Error("No results found");
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } catch (err) {
      console.error("Failed to fetch coordinates:", err);
      throw new Error("Invalid address");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVehicles((prev) => prev.filter((vehicle) => vehicle._id !== id));
    } catch (err) {
      alert("Failed to delete vehicle.");
    }
  };

  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setEditFormData({
      licensePlate: vehicle.licensePlate,
      make: vehicle.make,
      model: vehicle.model,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/vehicles/${editingVehicle._id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle._id === editingVehicle._id ? response.data : vehicle
        )
      );
      setShowEditModal(false);
    } catch (err) {
      alert("Failed to update vehicle.");
    }
  };

  const handleNewVehicleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewVehicle = async () => {
    try {
      const coordinates = await getCoordinatesFromAddress(
        newVehicleData.address
      );

      const response = await axios.post(
        `${API_BASE_URL}/vehicles`,
        {
          ...newVehicleData,
          location: coordinates,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const newVehicle = {
        ...response.data,
        address: await getHumanReadableAddress(
          response.data.location.latitude,
          response.data.location.longitude
        ),
      };
      setVehicles((prev) => [...prev, newVehicle]);
      setShowAddModal(false);
      setNewVehicleData({
        licensePlate: "",
        make: "",
        model: "",
        address: "",
      });
    } catch (err) {
      alert("Failed to add new vehicle. Please check the address.");
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div>
          <div className="spinner"></div>
          <p className="loading-text">Loading Vehicles...</p>
        </div>
      </div>
    );
  }
    if (error) return <p>{error}</p>;

  return <div className="management-container">
  <h1>Manage Vehicles</h1>
  <button onClick={() => setShowAddModal(true)}><FaPlus /> Add Vehicle</button>
  <table>
    <thead>
      <tr>
        <th>#</th> {/* Column for numbers */}
        <th>License Plate</th>
        <th>Make</th>
        <th>Model</th>
        <th>Location</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {vehicles.map((vehicle, index) => (
        <tr key={vehicle._id}>
          <td>{index + 1}</td> {/* Row number */}
          <td>{vehicle.licensePlate}</td>
          <td>{vehicle.make}</td>
          <td>{vehicle.model}</td>
          <td>{vehicle.address || "Fetching location..."}</td>
          <td>
            <button 
              onClick={() => handleEditClick(vehicle)} 
              className="edit-btn"
            >
              <FaEdit style={{ marginRight: '5px' }} /> Edit
            </button>
            <button 
              onClick={() => handleDelete(vehicle._id)} 
              className="delete-btn"
            >
              <FaTrash style={{ marginRight: '5px' }} /> Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {showAddModal && (
    <div className="modal">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddNewVehicle();
        }}
      >
        <label>
          License Plate:
          <input
            type="text"
            name="licensePlate"
            value={newVehicleData.licensePlate}
            onChange={handleNewVehicleChange}
          />
        </label>
        <label>
          Make:
          <input
            type="text"
            name="make"
            value={newVehicleData.make}
            onChange={handleNewVehicleChange}
          />
        </label>
        <label>
          Model:
          <input
            type="text"
            name="model"
            value={newVehicleData.model}
            onChange={handleNewVehicleChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={newVehicleData.address}
            onChange={handleNewVehicleChange}
          />
        </label>
        <button type="submit">Add</button>
        <button type="button" onClick={() => setShowAddModal(false)}>
          Cancel
        </button>
      </form>
    </div>
  )}

  {showEditModal && (
    <div className="modal">
      <h2>Edit Vehicle</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleEditSave();
        }}
      >
        <label>
          License Plate:
          <input
            type="text"
            name="licensePlate"
            value={editFormData.licensePlate}
            onChange={handleEditChange}
          />
        </label>
        <label>
          Make:
          <input
            type="text"
            name="make"
            value={editFormData.make}
            onChange={handleEditChange}
          />
        </label>
        <label>
          Model:
          <input
            type="text"
            name="model"
            value={editFormData.model}
            onChange={handleEditChange}
          />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={() => setShowEditModal(false)}>
          Cancel
        </button>
      </form>
    </div>
  )}
</div>
};

export default VehicleManagement;
