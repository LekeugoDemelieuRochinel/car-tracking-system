// AgencyProfileView.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        const profileResponse = await axios.get('/api/agency/profile'); // Adjust endpoint as needed
        const statsResponse = await axios.get('/api/agency/statistics'); // Adjust endpoint as needed

        setAgencyInfo(profileResponse.data);
        setStatistics(statsResponse.data);
      } catch (error) {
        console.error('Error fetching agency profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        {/* Placeholder Profile Picture */}
        <div
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#ccc',
            borderRadius: '50%',
            marginRight: '20px',
          }}
        ></div>

        {/* Agency Info */}
        <div>
          <h2>{agencyInfo.name || 'Agency Name'}</h2>
          <p>Username: {agencyInfo.username || 'Username'}</p>
        </div>
      </div>

      {/* Statistics Summary */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <StatCard label="Total Vehicles" value={statistics.totalVehicles} />
        <StatCard label="Assigned Drivers" value={statistics.assignedDrivers} />
        <StatCard label="Unassigned Drivers" value={statistics.unassignedDrivers} />
        <StatCard label="Total Drivers" value={statistics.totalDrivers} />
      </div>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ label, value }) => {
  return (
    <div
      style={{
        flex: '1 1 200px',
        padding: '20px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}
    >
      <h3 style={{ margin: '0 0 10px', color: '#007bff' }}>{value}</h3>
      <p style={{ margin: 0 }}>{label}</p>
    </div>
  );
};

export default AgencyProfileView;
