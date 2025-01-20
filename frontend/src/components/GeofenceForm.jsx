import React, { useState, useEffect } from "react";
import axios from "axios";
import "./vehiclestyle.css"; // Reusing the vehicle management page's CSS for consistency
import { FaPlus, FaTrash } from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api/geofences"; // Replace with your backend URL

const GeofenceManagement = () => {
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newGeofence, setNewGeofence] = useState({
    name: "",
    north: "",
    south: "",
    east: "",
    west: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchGeofences();
  }, []);

  const fetchGeofences = async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setGeofences(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch geofences.");
      setLoading(false);
    }
  };

  const handleAddGeofence = async () => {
    try {
      const boundaries = {
        north: parseFloat(newGeofence.north),
        south: parseFloat(newGeofence.south),
        east: parseFloat(newGeofence.east),
        west: parseFloat(newGeofence.west),
      };

      const response = await axios.post(
        API_BASE_URL,
        { name: newGeofence.name, boundaries },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setGeofences((prev) => [...prev, response.data]);
      setNewGeofence({ name: "", north: "", south: "", east: "", west: "" });
      setShowAddModal(false);
    } catch (err) {
      alert("Failed to add geofence.");
    }
  };

  const handleDeleteGeofence = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setGeofences((prev) => prev.filter((geofence) => geofence._id !== id));
    } catch (err) {
      alert("Failed to delete geofence.");
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div>
          <div className="spinner"></div>
          <p className="loading-text">Loading Geofences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="management-container">
      <h1>Management your Geofences</h1>
      <button className="add-btn" onClick={() => setShowAddModal(true)}>
        <FaPlus style={{ marginRight: "5px" }} /> Add Geofence
      </button>

      <table className="management-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>North</th>
            <th>South</th>
            <th>East</th>
            <th>West</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {geofences.map((geofence, index) => (
            <tr key={geofence._id}>
              <td>{index + 1}</td>
              <td>{geofence.name}</td>
              <td>{geofence.boundaries.north}</td>
              <td>{geofence.boundaries.south}</td>
              <td>{geofence.boundaries.east}</td>
              <td>{geofence.boundaries.west}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteGeofence(geofence._id)}
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
          <h2>Add Geofence</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddGeofence();
            }}
          >
            <label>
              Name:
              <input
                type="text"
                value={newGeofence.name}
                onChange={(e) =>
                  setNewGeofence({ ...newGeofence, name: e.target.value })
                }
                required
              />
            </label>
            <label>
              North:
              <input
                type="number"
                step="any"
                value={newGeofence.north}
                onChange={(e) =>
                  setNewGeofence({ ...newGeofence, north: e.target.value })
                }
                required
              />
            </label>
            <label>
              South:
              <input
                type="number"
                step="any"
                value={newGeofence.south}
                onChange={(e) =>
                  setNewGeofence({ ...newGeofence, south: e.target.value })
                }
                required
              />
            </label>
            <label>
              East:
              <input
                type="number"
                step="any"
                value={newGeofence.east}
                onChange={(e) =>
                  setNewGeofence({ ...newGeofence, east: e.target.value })
                }
                required
              />
            </label>
            <label>
              West:
              <input
                type="number"
                step="any"
                value={newGeofence.west}
                onChange={(e) =>
                  setNewGeofence({ ...newGeofence, west: e.target.value })
                }
                required
              />
            </label>

            <button type="submit">Add Geofence</button>
            <button type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GeofenceManagement;
