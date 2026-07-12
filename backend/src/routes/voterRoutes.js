import { Router } from "express";

import { registerVoter, loginVoter, logoutVoter, getVoter } from "../controllers/voterControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.post('/voters/register', registerVoter);
router.post('/voters/login', loginVoter);
router.post('/voters/logout', logoutVoter);
router.get('/voters/:id', authMiddleware, getVoter);

export default router;
