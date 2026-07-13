import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import httpError from '../utils/httpError.js';
import ElectionModel from '../models/electionModel.js';
import cloudinary from '../utils/cloudinary.js';
import CandidateModel from '../models/candidatesModel.js';
import VoterModel from '../models/voterModel.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

// POST: /elections
// PROTECTED ROUTE - Only accessible by admin users
export const addElection = async (req, res, next) => {
    try {
        // Only admin can update an election
        if(!req.user.isAdmin) {
            return next(new httpError('Unauthorized', 401));
        }

        const { title, description } = req.body;
        const { thumbnail } = req.files;

        // Validate required fields
        if (!title || !description || !thumbnail) {
            return res.status(400).json({
                message: 'Title, description, and thumbnail are required',
            });
        }

        // Check thumbnail size
        if (thumbnail.size > 1024 * 1024) {
            // 1MB limit
            return res
                .status(400)
                .json({ message: 'Thumbnail size should not exceed 1MB' });
        }

        // Rename the thumbnail file to avoid conflicts
        const thumbnailName = `${Date.now()}-${uuidv4()}-${thumbnail.name}`;
        const uploadPath = path.join(uploadsDir, thumbnailName);

        // Move the thumbnail to the uploads directory
        await thumbnail.mv(uploadPath, (err) => {
            if (err) {
                return next(new httpError('Failed to upload thumbnail', 500));
            }
        });

        // Save image to cloudinary
        const result = await cloudinary.uploader.upload(uploadPath, {
            folder: 'mern-votely/elections',
            use_filename: true,
            unique_filename: false,
        });

        if (!result.secure_url) {
            return next(
                new httpError('Failed to upload thumbnail to cloudinary', 422),
            );
        }

        const newElection = await ElectionModel.create({
            title,
            description,
            thumbnail: result.secure_url,
        });

        res.status(201).json({
            message: 'Election created successfully',
            newElection,
        });
    } catch (error) {
        return next(new httpError(error));
    }
};

// GET: /all-elections
// PROTECTED ROUTE
export const getAllElections = async (req, res, next) => {
    try {
        const elections = await ElectionModel.find({});
        res.status(200).json(elections);
    } catch (error) {
        return next(new httpError(error));
    }
};

// GET: /elections/:id
// PROTECTED ROUTE
export const getElectionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const election = await ElectionModel.findById(id);
        if (!election) {
            return next(new httpError('Election not found', 404));
        }
        res.status(200).json(election);
    } catch (error) {
        return next(new httpError(error));
    }
};

// DELETE: /elections/:id
// PROTECTED ROUTE - Only accessible by admin users
export const deleteElection = async (req, res, next) => {
    try {
        // Only admin can update an election
        if(!req.user.isAdmin) {
            return next(new httpError('Unauthorized', 401));
        }

        const { id } = req.params;
        const election = await ElectionModel.findById(id);
        if (!election) {
            return next(new httpError('Election not found', 404));
        }
        await election.deleteOne();

        // Delete all candidates for this election
        await CandidateModel.deleteMany({ electionId: id });
        // Remove this election from each voter's votedElections array
        await VoterModel.updateMany(
            { votedElections: id },
            { $pull: { votedElections: id } },
        );
        res.status(200).json({
            message: 'Election deleted successfully',
            election,
        });
    } catch (error) {
        return next(new httpError(error));
    }
};

// PATCH: /elections/:id
// PROTECTED ROUTE - Only accessible by admin users
export const updateElection = async (req, res, next) => {
    try {
        // Only admin can update an election
        if(!req.user.isAdmin) {
            return next(new httpError('Unauthorized', 401));
        }

        const { id } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            return next(
                new httpError('Title and description are required', 422),
            );
        }

        const updateData = { title, description };

        if (req.files?.thumbnail) {
            let { thumbnail } = req.files;

            if (thumbnail.size > 1024 * 1024) {
                return next(
                    new httpError('Thumbnail size should not exceed 1MB', 422),
                );
            }
            const thumbnailName = `${Date.now()}-${uuidv4()}-${thumbnail.name}`;
            const uploadPath = path.join(uploadsDir, thumbnailName);
            await thumbnail.mv(uploadPath, (err) => {
                if (err) {
                    return next(
                        new httpError('Failed to upload thumbnail', 500),
                    );
                }
            });
            const result = await cloudinary.uploader.upload(uploadPath, {
                folder: 'mern-votely/elections',
                use_filename: true,
                unique_filename: false,
            });

            if (!result.secure_url) {
                return next(
                    new httpError(
                        'Failed to upload thumbnail to cloudinary',
                        422,
                    ),
                );
            }

            updateData.thumbnail = result.secure_url;
        }

        const election = await ElectionModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true },
        );

        if (!election) {
            return next(new httpError('Election not found', 404));
        }

        res.status(200).json({ message: 'Election updated successfully' });
    } catch (error) {
        return next(new httpError(error));
    }
};

// GET: /elections/:id/candidates
// PROTECTED ROUTE
export const getCandidatesByElectionId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const candidates = await CandidateModel.find({ electionId: id });

        const voter = await VoterModel.findById(req.user.id).select('votedElections');
        const hasVoted = voter?.votedElections.some((electionId) => electionId.toString() === id) ?? false;

        res.status(200).json({
            message: 'Candidates for the election retrieved successfully',
            candidates,
            hasVoted,
        });
    } catch (error) {
        return next(new httpError(error));
    }
};

export const getVotersByElectionId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const election = await ElectionModel.findById(id).populate('voters', '-password');

        if (!election) {
            return next(new httpError('Election not found', 404));
        }

        res.status(200).json({
            message: 'Voters for the election retrieved successfully',
            voters: election.voters,
        });
    } catch (error) {
        return next(new httpError(error));
    }
};
