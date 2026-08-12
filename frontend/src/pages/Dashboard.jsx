import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalProperties: 0,
    totalUnits: 0,
    totalTenants: 0,
    totalActiveTenancies: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/dashboard/summary');
        setSummary(response.data);
      } catch (err) {
        setError('Failed to load dashboard metrics');
        console.error(err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Organization Overview</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
          
          <div style={{ padding: '20px', backgroundColor: 'white', borderLeft: '5px solid #3498db', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>Properties</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{summary.totalProperties}</p>
          </div>

          <div style={{ padding: '20px', backgroundColor: 'white', borderLeft: '5px solid #9b59b6', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>Units</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{summary.totalUnits}</p>
          </div>

          <div style={{ padding: '20px', backgroundColor: 'white', borderLeft: '5px solid #f1c40f', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>Tenants</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{summary.totalTenants}</p>
          </div>

          <div style={{ padding: '20px', backgroundColor: 'white', borderLeft: '5px solid #2ecc71', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>Active Tenancies</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{summary.totalActiveTenancies}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;