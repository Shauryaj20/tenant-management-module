import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({ unitNumber: '', rentAmount: '', propertyId: '' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [unitsRes, propertiesRes] = await Promise.all([
        api.get('/units'),
        api.get('/properties')
      ]);
      setUnits(unitsRes.data);
      setProperties(propertiesRes.data);
      
      if (propertiesRes.data.length > 0) {
        setFormData(prev => ({ ...prev, propertyId: propertiesRes.data[0]._id }));
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
    try {
      await api.post('/units', formData);
      setFormData({ unitNumber: '', rentAmount: '', propertyId: properties.length > 0 ? properties[0]._id : '' });
      fetchData(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding unit');
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Manage Units</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {/* Form Section */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Add New Unit</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" name="unitNumber" placeholder="Unit Number (e.g., Apt 101)" value={formData.unitNumber} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
            <input type="number" name="rentAmount" placeholder="Rent Amount ($)" value={formData.rentAmount} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
            <select name="propertyId" value={formData.propertyId} onChange={handleChange} required style={{ padding: '8px', flex: 1 }}>
              {properties.length === 0 ? (
                <option value="" disabled>No properties available</option>
              ) : (
                properties.map(prop => (
                  <option key={prop._id} value={prop._id}>{prop.name}</option>
                ))
              )}
            </select>
            <button type="submit" disabled={properties.length === 0} style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: properties.length === 0 ? 'not-allowed' : 'pointer' }}>
              Add Unit
            </button>
          </form>
          {properties.length === 0 && <p style={{ color: '#e74c3c', fontSize: '14px', marginTop: '10px' }}>You must create a property before you can add a unit.</p>}
        </div>

        {/* List Section */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Unit List</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {units.map((unit) => (
              <li key={unit._id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Unit {unit.unitNumber}</strong>
                  <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '5px' }}>
                    Property: {unit.propertyId ? unit.propertyId.name : 'Unknown Property'}
                  </div>
                </div>
                <span style={{ fontWeight: 'bold', color: '#2ecc71' }}>
                  ${unit.rentAmount}/mo
                </span>
              </li>
            ))}
            {units.length === 0 && <p style={{ color: '#7f8c8d' }}>No units found. Add one above!</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Units;