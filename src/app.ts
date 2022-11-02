import express  from "express";
import 'express-async-errors';
import cors from 'cors';
import patientRoutes from './routes/patient';
import eventRoutes from './routes/event';
import messageRoutes from './routes/message';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/patient', patientRoutes);
app.use('/event', eventRoutes);
app.use('/message', messageRoutes);

export default app;