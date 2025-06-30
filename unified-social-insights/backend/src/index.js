const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log("✅ JWT Secret loaded from .env:", process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/test', (req, res) => {
  res.status(200).json({ success: true, message: 'API is live' });
});

try {
  app.use('/api/auth', require('./routes/authRoutes'));
  console.log('✅ Auth routes loaded successfully');
} catch (err) {
  console.error('❌ Error loading auth routes:', err.message);
}

// Add this after app.use('/api/auth', ...)
app.use('/api/meta', require('./routes/metaRoutes'));

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
  });
});

// ✅ Use port from .env or default to 3000
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting server...');
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB()
    .then(() => console.log('✅ Database connected successfully'))
    .catch(err => console.error('❌ DB connection failed:', err.message));
});
