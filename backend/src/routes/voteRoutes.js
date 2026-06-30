import { Router } from "express";
import { castVote } from "../controllers/voteController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post('/votes', authMiddleware, castVote);

export default router;
