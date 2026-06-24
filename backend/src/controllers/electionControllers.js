import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import httpError from '../utils/httpError.js';
import ElectionModel from '../models/electionModel.js';
import cloudinary from '../utils/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

// POST: /elections
// PROTECTED ROUTE - Only accessible by admin users
export const addElection = async (req, res, next) => {
    try {
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
export const getAllElections = (req, res, next) => {
    res.json({ message: 'All Elections retrieved successfully' });
};

// GET: /elections/:id
// PROTECTED ROUTE
export const getElectionById = (req, res, next) => {
    res.json({ message: 'Election retrieved successfully' });
};

// DELETE: /elections/:id
// PROTECTED ROUTE - Only accessible by admin users
export const deleteElection = (req, res, next) => {
    res.json({ message: 'Election deleted successfully' });
};

// PATCH: /elections/:id
// PROTECTED ROUTE - Only accessible by admin users
export const updateElection = (req, res, next) => {
    res.json({ message: 'Election updated successfully' });
};

// GET: /elections/:id/candidates
// PROTECTED ROUTE
export const getCandidatesByElectionId = (req, res, next) => {
    res.json({ message: 'Candidates for the election retrieved successfully' });
};

// GET: /elections/:id/voters
// PROTECTED ROUTE
export const getVotersByElectionId = (req, res, next) => {
    res.json({ message: 'Voters for the election retrieved successfully' });
};
