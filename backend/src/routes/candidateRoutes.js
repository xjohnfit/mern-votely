import { Router } from 'express';
import {
    addCandidate,
    getCandidate,
    getAllCandidates,
    updateCandidate,
    deleteCandidate,
} from '../controllers/candidateController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/candidates/', authMiddleware, addCandidate);
router.get('/candidates/:id', authMiddleware, getCandidate);
router.get('/candidates/', authMiddleware, getAllCandidates);
router.patch('/candidates/:id', authMiddleware, updateCandidate);
router.delete('/candidates/:id', authMiddleware, deleteCandidate);

export default router;
