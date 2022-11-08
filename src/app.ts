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

const origin =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_PROD_URL
    : process.env.FRONTEND_LOCAL_URL;

app.use(cors({
    origin,
    preflightContinue: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }));

app.use(express.json());
app.use(cookieParser());
app.use('/register', registerRoutes);
app.use('/auth', authRoutes);

app.use(verifyJWT);
app.use(verifyRole('admin'));
app.use('/patient', patientRoutes);
app.use('/event', eventRoutes);

export default app;