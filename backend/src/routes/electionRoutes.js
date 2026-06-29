import { Router } from 'express';
import {
    addElection,
    getAllElections,
    getElectionById,
    deleteElection,
    updateElection,
    getCandidatesByElectionId,
    getVotersByElectionId,
} from '../controllers/electionControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/elections', authMiddleware, addElection);
router.get('/all-elections', authMiddleware, getAllElections);
router.get('/elections/:id', authMiddleware, getElectionById);
router.delete('/elections/:id', authMiddleware, deleteElection);
router.patch('/elections/:id', authMiddleware, updateElection);
router.get('/elections/:id/candidates', authMiddleware, getCandidatesByElectionId);
router.get('/elections/:id/voters', authMiddleware, getVotersByElectionId);

export default router;
