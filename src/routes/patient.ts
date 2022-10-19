import express from "express";
import { addPatient, deletePatient, getAllPatients, updatePatient } from "../controllers/patient";

const router = express.Router();

router.get('/', getAllPatients);
router.post('/', addPatient);
router.patch('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;