import express  from "express";
import 'express-async-errors';
import cors from 'cors';
import verifyJWT from "./middleware/verifyJWT";
import cookieParser from 'cookie-parser';
import patientRoutes from './routes/patient';
import eventRoutes from './routes/event';
import registerRoutes from './routes/register';
import authRoutes from './routes/auth';
import verifyRole from "./middleware/verifyRole";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/register', registerRoutes);
app.use('/auth', authRoutes);

app.use(verifyJWT);
app.use(verifyRole('admin'));
app.use('/patient', patientRoutes);
app.use('/event', eventRoutes);

export default app;