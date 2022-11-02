import express from "express";
import { sendMessage } from "../controllers/message";

const router = express.Router();

router.post('/', sendMessage);

export default router;