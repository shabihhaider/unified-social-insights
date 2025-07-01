const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');

const app = express();

// ✅ CORS config: restrict origin in production
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

console.log("✅ Middleware loaded");
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Health check
app.get('/api/test', (req, res) => {
  res.status(200).json({ success: true, message: 'API is live' });
});

// ✅ Auth routes
try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log("✅ Auth routes loaded");
} catch (err) {
  console.error("❌ Error loading authRoutes:", err.message);
}

// ✅ Meta Graph API routes (mock/live)
try {
  const metaRoutes = process.env.USE_MOCK === 'true'
    ? require('./routes/metaRoutes')
    : require('./routes/liveMetaRoutes');
  app.use('/api/meta', metaRoutes);
  console.log(`✅ Meta routes loaded (${process.env.USE_MOCK === 'true' ? 'MOCK' : 'LIVE'})`);
} catch (err) {
  console.error("❌ Error loading Meta routes:", err.message);
}

// ✅ API 404 fallback
app.use('/api', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    availableRoutes: [
      'GET /api/test',
      'POST /api/auth/register',
      'POST /api/auth/email-login',
      'GET /api/auth/me',
      'GET /api/meta/pages'
    ]
  });
});

// ✅ Serve React frontend build
const frontendPath = path.resolve(__dirname, '../../frontend/build');
app.use(express.static(frontendPath));

// ✅ SPA fallback: All non-API routes redirect to React
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
console.log('🚀 Starting server...');

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB()
    .then(() => console.log('✅ Database connected successfully'))
    .catch(err => console.error('❌ DB connection failed:', err.message));
});
