import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [documentFile, setDocumentFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchTenants = async () => {
    try {
      const response = await api.get('/tenants');
      setTenants(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tenants');
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/tenants/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/tenants', formData);
      }
      fetchTenants();
      setFormData({ name: '', email: '', phone: '' }); 
    } catch (err) {
      console.error(err);
      setError('Error saving tenant');
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this tenant?\n\nWARNING: This will permanently delete their Active Leases and revoke their unit access!"
    );
    if (!isConfirmed) return;
    try {
      await api.delete(`/tenants/${id}`);
      fetchTenants(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting tenant');
    }
  };
  const handleEditClick = (tenant) => {
    setEditingId(tenant._id);
    setFormData({ 
      name: tenant.name, 
      email: tenant.email,
      phone: tenant.phone,
      documentUrl: tenant.documentUrl || '' 
    }); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Manage Tenants</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {/* Form Section */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Add New Tenant</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
              <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <label style={{ fontWeight: 'bold', color: '#34495e' }}>ID Proof / Document:</label>
              <input type="file" id="file-upload" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" style={{ padding: '5px' }} />              
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {editingId ? 'Update Tenant' : 'Add Tenant'}
              </button>
              {editingId && (
                <button type="button" onClick={() => {setEditingId(null); setFormData({ name: '', email: '', phone: '' });}}
                style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel Edit
                </button>
              )}
            </div>
            </div>
          </form>
        </div>

        {/* List Section */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Tenant List</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {tenants.map((tenant) => (
              <li key={tenant._id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{tenant.name}</strong>
                  <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '5px' }}>
                    {tenant.email} | {tenant.phone}
                  </div>
                </div>
                {tenant.documentUrl ? (
                  <a href={`http://localhost:5000${tenant.documentUrl}`} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', backgroundColor: '#e8f4f8', color: '#3498db', textDecoration: 'none', borderRadius: '4px', fontSize: '13px' }}>
                    View Document
                  </a>
                ) : (
                  <span style={{ fontSize: '13px', color: '#bdc3c7' }}>No Document</span>
                )}
                <button onClick={() => handleDelete(tenant._id)} style={{ padding: '4px 8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                  Delete
                </button>
                <button onClick={() => handleEditClick(tenant)} style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
                  Edit
                </button>
              </li>
            ))}
            {tenants.length === 0 && <p style={{ color: '#7f8c8d' }}>No tenants found. Add one above!</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tenants;