import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import savedPropertyRoutes from './routes/savedPropertyRoutes';
import dealRoutes from './routes/dealRoutes';
import seedRoutes from './routes/seedRoutes';
import uploadRoutes from './routes/uploadRoutes';
import notificationRoutes from './routes/notificationRoutes';
import requestRoutes from './routes/requestRoutes';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/saved-properties', savedPropertyRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/requests', requestRoutes); 

export default app;
