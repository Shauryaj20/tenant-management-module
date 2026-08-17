import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Tenancies = () => {
  const [tenancies, setTenancies] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [formData, setFormData] = useState({ 
    tenantId: '', 
    unitId: '', 
    startDate: '', 
    endDate: '', 
    rentAmount: '', 
    securityDeposit: '' 
});  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [tenanciesRes, unitsRes, tenantsRes] = await Promise.all([
        api.get('/tenancies'),
        api.get('/units'),
        api.get('/tenants')
      ]);
      setTenancies(tenanciesRes.data);
      setUnits(unitsRes.data);
      setTenants(tenantsRes.data);
      
      if (unitsRes.data.length > 0 && tenantsRes.data.length > 0) {
        setFormData(prev => ({ ...prev, unitId: unitsRes.data[0]._id, tenantId: tenantsRes.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      await api.post('/tenancies', formData);
      
      setFormData(prev => ({ ...prev, startDate: '', endDate: '', rentAmount: '', securityDeposit: '' })); 
      fetchData(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating tenancy');
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to end and delete this active lease?");
    if (!isConfirmed) return;
    try {
      await api.delete(`/tenancies/${id}`);
      fetchData(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting tenancy');
    }
  };
  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Manage Tenancies (Leases)</h2>
        {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
        
        {/* Form Section */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Create New Tenancy</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>Select Unit</label>
              <select name="unitId" value={formData.unitId} onChange={handleChange} required style={{ padding: '8px' }}>
                {units.length === 0 ? <option value="" disabled>No Units Available</option> : units.map(unit => (
                  <option key={unit._id} value={unit._id}>Unit {unit.unitNumber} ({unit.propertyId?.name})</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>Select Tenant</label>
              <select name="tenantId" value={formData.tenantId} onChange={handleChange} required style={{ padding: '8px' }}>
                {tenants.length === 0 ? <option value="" disabled>No Tenants Available</option> : tenants.map(tenant => (
                  <option key={tenant._id} value={tenant._id}>{tenant.name}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required style={{ padding: '8px' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>Rent Amount ($)</label>
              <input type="number" name="rentAmount" value={formData.rentAmount} onChange={handleChange} placeholder="e.g., 1500" required />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>Security Deposit ($)</label>
              <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} placeholder="e.g., 1500" required />
            </div>
            <button type="submit" disabled={units.length === 0 || tenants.length === 0} style={{ padding: '8px 16px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: (units.length === 0 || tenants.length === 0) ? 'not-allowed' : 'pointer', marginTop: '18px' }}>
              Assign Tenant
            </button>
          </form>
          {(units.length === 0 || tenants.length === 0) && <p style={{ color: '#e74c3c', fontSize: '14px', marginTop: '10px' }}>You must have at least one Unit and one Tenant to create a lease.</p>}
        </div>

        {/* List Section */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Active Leases</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {tenancies.map((tenancy) => (
              <li key={tenancy._id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{tenancy.tenantId?.name || 'Unknown Tenant'}</strong> 
                  <span style={{ margin: '0 10px', color: '#7f8c8d' }}>renting</span> 
                  <strong>Unit {tenancy.unitId?.unitNumber || 'Unknown Unit'}</strong>
                  <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '5px' }}>
                    {tenancy.startDate ? `Started: ${new Date(tenancy.startDate).toLocaleDateString()}`: 'Start Date: Not Set'}
                    {tenancy.endDate ? ` | Ends: ${new Date(tenancy.endDate).toLocaleDateString()}`: ' | End Date: Not Set'}
                    <br />
                    {tenancy.rentAmount ? `Rent: $${tenancy.rentAmount} /mo`: 'Rent: Not Mentioned'} 
                    {tenancy.securityDeposit ? ` | Deposit: $${tenancy.securityDeposit}`: ' | Deposit: Not Mentioned'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ padding: '4px 8px', backgroundColor: '#e8f8f5', color: '#2ecc71', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    {tenancy.status.toUpperCase()}
                  </span>
                  <button onClick={() => handleDelete(tenancy._id)} style={{ padding: '4px 8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {tenancies.length === 0 && <p style={{ color: '#7f8c8d' }}>No tenancies found. Create one above!</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tenancies;