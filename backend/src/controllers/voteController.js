import mongoose from "mongoose";
import httpError from "../utils/httpError.js";
import CandidateModel from "../models/candidatesModel.js";
import VoterModel from "../models/voterModel.js";
import ElectionModel from "../models/electionModel.js";

// Cast Vote
// POST: /votes
// PROTECTED ROUTE - Only accessible by authenticated voters
export const castVote = async (req, res, next) => {
    try {
        const { electionId, candidateId } = req.body;
        const voterId = req.user.id;

        if (!electionId || !candidateId) {
            return next(new httpError("electionId and candidateId are required", 422));
        }

        const voter = await VoterModel.findById(voterId);
        if (!voter) {
            return next(new httpError("Voter not found", 404));
        }

        if (voter.votedElections.includes(electionId)) {
            return next(new httpError("You have already voted in this election", 400));
        }

        const election = await ElectionModel.findById(electionId);
        if (!election) {
            return next(new httpError("Election not found", 404));
        }

        const candidate = await CandidateModel.findOne({ _id: candidateId, electionId });
        if (!candidate) {
            return next(new httpError("Candidate not found in this election", 404));
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            candidate.voteCount++;
            await candidate.save({ session });

            voter.votedElections.push(electionId);
            await voter.save({ session });

            election.voters.push(voterId);
            await election.save({ session });

            await session.commitTransaction();
        } catch (txError) {
            await session.abortTransaction();
            throw txError;
        } finally {
            session.endSession();
        }

        res.status(200).json({ message: "Vote cast successfully" });
    } catch (error) {
        return next(new httpError(error.message, 422));
    }
};
