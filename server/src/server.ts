import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database';

// Load environment variables first
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));  

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes - IMPORTANT: Order matters!
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 404 handler
app.use( (req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Database connection and server start
const startServer = async (): Promise<void> => {
  try {
    // Check required environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is required');
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is required');
    }

    // Connect to database
    await connectDatabase();

    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` API Base URL: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();