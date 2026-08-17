import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({ name: '', address: '', type: 'residential' });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

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
      if (editingId) {
        await api.put(`/properties/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/properties', formData);
      }
      fetchProperties(); 
      setFormData({ name: '', address: '', type: 'residential' });    
    } catch (err) {
      console.error(err);
      setError('Error saving property');
    }
  };
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this property?\n\nWARNING: This will permanently delete ALL Units and Active Leases associated with this property!"
    );
    if (!isConfirmed) return;
    try {
      await api.delete(`/properties/${id}`);
      fetchProperties(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting property');
    }
  };
  const handleEditClick = (propertyData) => {
    setEditingId(propertyData._id);
    setFormData({ 
      name: propertyData.name, 
      address: propertyData.address,
      type: propertyData.type || 'residential'
    }); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Manage Properties</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            name="name" 
            placeholder="Property Name (e.g., Sky high flats)" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: '1' }}
          />
          <input 
            type="text" 
            name="address" 
            placeholder="Property Address" 
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})} 
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: '2' }}
          />
          <select
            name="type"
            value={formData.type || 'residential'}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {editingId ? 'Update Property' : 'Add Property'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', address: '', type: 'residential' });
                }} 
                style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

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
                  <button onClick={() => handleEditClick(prop)} style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
                    Edit
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