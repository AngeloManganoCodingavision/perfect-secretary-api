import express from "express";
import { addEvent, deleteEvent, getAllEvents, updateEvent } from "../controllers/event";

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', addEvent);
router.patch('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;