import express from "express";
import { handleLogin, handleRefreshToken } from "../controllers/auth";

const router = express.Router();

router.get('/', handleRefreshToken);
router.post('/', handleLogin);

export default router;