import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBuilding } from 'react-icons/fa';
import "./vehiclestyle.css";

const AgencyProfileView = () => {
  const [agencyInfo, setAgencyInfo] = useState({});
  const [statistics, setStatistics] = useState({
    totalVehicles: 0,
    assignedDrivers: 0,
    unassignedDrivers: 0,
    totalDrivers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch agency profile and statistics
    const fetchProfileData = async () => {
      try {
        const profileResponse = await axios.get('http://localhost:5000/api/agencies/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        setAgencyInfo(profileResponse.data.agency);
        setStatistics(profileResponse.data.statistics);
      } catch (error) {
        console.error('Error fetching agency profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div>
          <div className="spinner"></div>
          <p className="loading-text">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f1f5f9', padding: '40px', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Placeholder Profile Picture */}
        <div
          style={{
            width: '120px',
            height: '120px',
            backgroundColor: '#e9ecef',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '20px',
          }}
        >
          <FaBuilding size={60} color="#007bff" />
        </div>

        {/* Agency Info */}
        <div>
          <h1 style={{ fontSize: '28px', margin: '0 0 10px', color: '#343a40' }}>{agencyInfo.name || 'Agency Name'}</h1>
          <p style={{ fontSize: '18px', margin: '0', color: '#6c757d' }}>Username: {agencyInfo.username || 'Username'}</p>
        </div>
      </div>

      {/* Statistics Summary */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <StatCard label="Total Vehicles" value={statistics.totalVehicles} />
        <StatCard label="Total Drivers" value={statistics.totalDrivers} />
        <StatCard label="Assigned Drivers" value={statistics.assignedDrivers} />
        <StatCard label="Unassigned Drivers" value={statistics.unassignedDrivers} />
      </div>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ label, value }) => {
  return (
    <div
      style={{
        flex: '1 1 220px',
        padding: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        borderRadius: '12px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      <h3 style={{ margin: '0 0 10px', fontSize: '24px', color: '#007bff' }}>{value}</h3>
      <p style={{ margin: 0, fontSize: '16px', color: '#495057' }}>{label}</p>
    </div>
  );
};

export default AgencyProfileView;
