import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white' }}>
      <h2 style={{ margin: 0 }}>Tenant Management System</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/properties" style={{ color: 'white', textDecoration: 'none' }}>Properties</Link>
        <Link to="/units" style={{ color: 'white', textDecoration: 'none' }}>Units</Link> 
        <span style={{ fontStyle: 'italic' }}>Welcome, {user?.name || 'User'}</span>
        
        <button 
          onClick={handleLogout} 
          style={{ padding: '5px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;