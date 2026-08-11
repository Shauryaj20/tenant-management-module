require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/authRoutes');
const propertyRoutes = require('./src/routes/propertyRoutes');
const unitRoutes = require('./src/routes/unitRoutes'); 
const tenantRoutes = require('./src/routes/tenantRoutes'); 
const tenancyRoutes = require('./src/routes/tenancyRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

// Mount Routes
app.use('/auth', authRoutes);
app.use('/properties', propertyRoutes); 
app.use('/units', unitRoutes); 
app.use('/tenants', tenantRoutes); 
app.use('/tenancies', tenancyRoutes); 
app.use('/dashboard', dashboardRoutes);
app.use('/upload', uploadRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Tenant Management API is running...');
});

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection unsuccessful:', error.message);
  });

