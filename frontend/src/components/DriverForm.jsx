import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaCar } from "react-icons/fa";
import "./vehiclestyle.css";
import "./driverstyle.css"

const API_BASE_URL = "http://localhost:5000/api"; // Replace with your backend URL

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const [newDriverData, setNewDriverData] = useState({
    name: "",
    age: "",
    residence: "",
  });

  const [editingDriver, setEditingDriver] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    age: "",
    residence: "",
    vehicle: ""
  });

  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(response.data)
      setDrivers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch drivers.");
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVehicles(response.data);
    } catch (err) {
      console.error("Failed to fetch vehicles.");
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/drivers/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDrivers((prev) => prev.filter((driver) => driver._id !== id));
    } catch (err) {
      alert("Failed to delete driver.");
    }
  };

  const handleEditClick = (driver) => {
    console.log("editing")
    setEditingDriver(driver);
    setEditFormData({
      name: driver.name,
      age: driver.age,
      residence: driver.residence,
      vehicle: `${driver.vehicleId.make} (${editingDriver.vehicleId.licensePlate})`

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
        `${API_BASE_URL}/drivers/${editingDriver._id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDrivers((prev) =>
        prev.map((driver) =>
          driver._id === editingDriver._id ? response.data : driver
        )
      );
      setShowEditModal(false);
    } catch (err) {
      alert("Failed to update driver.");
    }
  };

  const handleNewDriverChange = (e) => {
    const { name, value } = e.target;
    setNewDriverData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewDriver = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/drivers`,
        newDriverData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDrivers((prev) => [...prev, response.data]);
      setShowAddModal(false);
      setNewDriverData({
        name: "",
        age: "",
        residence: "",
      });
    } catch (err) {
      alert("Failed to add new driver.");
    }
  };

  const handleAssignVehicle = async (vehicleId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/drivers/${selectedDriver._id}/vehicle`,
        { vehicleId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Update drivers state
      setDrivers((prev) =>
        prev.map((driver) =>
          driver._id === selectedDriver._id ? response.data : driver
        )
      );

      // Update editFormData with the new vehicle
      setEditFormData((prev) => ({
        ...prev,
        vehicle: `${response.data.vehicleId.make} (${response.data.vehicleId.licensePlate})`,
      }));

      setShowVehicleModal(false);
      setSelectedDriver(null);
    } catch (err) {
      alert("Failed to assign vehicle.");
    }
  };
  if (loading) {
    return (
      <div className="loading-overlay">
        <div>
          <div className="spinner"></div>
          <p className="loading-text">Loading Drivers...</p>
        </div>
      </div>
    );
  }
  if (error) return <p>{error}</p>;

  return (
    <div className="driver-management">
      <h1>Manage Drivers</h1>
      <button onClick={() => setShowAddModal(true)} className="primary-btn">
        <FaPlus /> Add Driver
      </button>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Residence</th>
            <th>Vehicle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver, index) => (
            <tr key={driver._id}>
              <td>{index + 1}</td>
              <td>{driver.name}</td>
              <td>{driver.age}</td>
              <td>{driver.residence}</td>
              <td>
                {driver.vehicleId ? (
                  `${driver.vehicleId.make} (${driver.vehicleId.licensePlate})`
                ) : (
                  <button
                    onClick={() => {
                      setSelectedDriver(driver);
                      setShowVehicleModal(true);
                    }}
                    className="assign-btn"
                  >
                    <FaCar style={{ marginRight: "5px" }} /> Assign Vehicle
                  </button>
                )}
              </td>
              <td>
                <button
                  onClick={() => handleEditClick(driver)}
                  className="edit-btn"
                >
                  <FaEdit style={{ marginRight: "5px" }} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteDriver(driver._id)}
                  className="delete-btn"
                >
                  <FaTrash style={{ marginRight: "5px" }} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <div className="modal">
          <h2>Add New Driver</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddNewDriver();
            }}
          >
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={newDriverData.name}
                onChange={handleNewDriverChange}
              />
            </label>
            <label>
              Age:
              <input
                type="number"
                name="age"
                value={newDriverData.age}
                onChange={handleNewDriverChange}
              />
            </label>
            <label>
              Residence:
              <input
                type="text"
                name="residence"
                value={newDriverData.residence}
                onChange={handleNewDriverChange}
              />
            </label>
            <button type="submit" className="primary-btn">Add</button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {showVehicleModal && (
        <div className="vehicle-modal">
          <h2>Assign Vehicle to {selectedDriver.name}</h2>
          <ul>
            {vehicles.map((vehicle) => (
              <li key={vehicle._id}>
                <button
                  onClick={() => handleAssignVehicle(vehicle._id)}
                  className="assign-btn"
                >
                  {vehicle.make} ({vehicle.licensePlate})
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowVehicleModal(false)}
            className="secondary-btn"
          >
            Cancel
          </button>
        </div>
      )}
      {showEditModal && (
        <div className="modal">
          <h2>Edit Driver</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSave();
            }}
          >
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Age:
              <input
                type="number"
                name="age"
                value={editFormData.age}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Residence:
              <input
                type="text"
                name="residence"
                value={editFormData.residence}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Vehicle:
              <input
                type="text"
                value={editFormData.vehicle ? `${editFormData.vehicle}` : 'No Vehicle Assigned'}
                readOnly
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedDriver(editingDriver);
                  setShowVehicleModal(true);
                }}
                className="assign-btn"
              >
                Change
              </button>
            </label>
            <button type="submit" className="primary-btn">
              Save Changes
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default DriverManagement;
