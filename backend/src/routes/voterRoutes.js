import { Router } from "express";

import { registerVoter, loginVoter, getVoter } from "../controllers/voterControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.post('/voters/register', registerVoter);
router.post('/voters/login', loginVoter);
router.get('/voters/:id', authMiddleware, getVoter);

export default router;
