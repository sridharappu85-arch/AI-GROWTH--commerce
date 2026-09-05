import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';
import cartRoutes from './routes/cart';
import ordersRoutes from './routes/orders';
import wishlistRoutes from './routes/wishlist';
import profileRoutes from './routes/profile';
import agentsRoutes from './routes/agents';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Growth & Agentic Commerce Engine',
    version: '1.0.0'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 NexAgentic Full-Stack Backend running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Agent Chat:   http://localhost:${PORT}/api/agents/chat`);
  console.log(`📊 Admin BI:     http://localhost:${PORT}/api/admin/metrics`);
  console.log(`=======================================================`);
});

export default app;
