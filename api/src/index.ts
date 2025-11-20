import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import vehiclesRoutes from './routes/vehicles';
import partnersRoutes from './routes/partners';
import inspectionsRoutes from './routes/inspections';
import maintenancesRoutes from './routes/maintenances';
import usersRoutes from './routes/users';
import refuelingsRoutes from './routes/refuelings';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes(prisma));
app.use('/api/vehicles', vehiclesRoutes(prisma));
app.use('/api/partners', partnersRoutes(prisma));
app.use('/api/inspections', inspectionsRoutes(prisma));
app.use('/api/maintenances', maintenancesRoutes(prisma));
app.use('/api/users', usersRoutes(prisma));
app.use('/api/refuelings', refuelingsRoutes(prisma));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handling middleware (deve vir por último)
app.use(errorHandler);

const port = process.env.PORT || 4000;

// Graceful shutdown
const server = app.listen(port, () => {
  console.log(`🚀 API listening on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});

// Log unexpected errors to diagnose early exits
process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
