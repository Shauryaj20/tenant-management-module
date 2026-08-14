import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({ name: '', address: '', type: 'residential' });
  const [error, setError] = useState('');

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch properties');
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/properties', formData);
      setFormData({ name: '', address: '', type: 'residential' }); // Clear the form
      fetchProperties(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding property');
    }
  };
  const handleDelete = async (id) => {
    // Add a quick confirmation popup so users don't delete by accident
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await api.delete(`/properties/${id}`);
      fetchProperties(); // Refresh the list instantly
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting property');
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Manage Properties</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Add New Property</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" name="name" placeholder="Property Name (e.g., Sunset Apartments)" value={formData.name} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
            <input type="text" name="address" placeholder="Property Address" value={formData.address} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
            <select name="type" value={formData.type} onChange={handleChange} style={{ padding: '8px' }}>
              <option value="residential"> Residential </option>
              <option value="commercial"> Commercial </option>
            </select>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Add Property
            </button>
          </form>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Property List</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {properties.map((prop) => (
              <li key={prop._id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{prop.name}</strong>
                  <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '5px' }}>{prop.address}</div>
                </div>
                <div>
                  <span style={{ padding: '4px 8px', backgroundColor: '#e8f4f8', color: '#3498db', borderRadius: '4px', fontSize: '12px', height: 'fit-content' }}>
                    {prop.type ? prop.type.toUpperCase() : 'RESIDENTIAL'}
                  </span>
                  <button onClick={() => handleDelete(prop._id)} style={{ marginLeft: '10px', padding: '4px 8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {properties.length === 0 && <p style={{ color: '#7f8c8d' }}>No properties found. Add one above!</p>}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Properties;