import express  from "express";
import 'express-async-errors';
import patientRoutes from './routes/patient';

const app = express();

app.use(express.json());
app.use('/patient', patientRoutes);

export default app;