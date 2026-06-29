import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import httpError from '../utils/httpError.js';
import CandidateModel from '../models/candidatesModel.js';
import ElectionModel from '../models/electionModel.js';
import cloudinary from '../utils/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

// ADD CANDIDATE
// POST: /candidates
// PROTECTED ROUTE - Only accessible by admin users
export const addCandidate = async (req, res, next) => {
    try {

        // Only admin can add a candidate
        if(!req.user.isAdmin) {
            return next(new httpError('Unauthorized', 401));
        }

        const { fullName, motto, electionId } = req.body;

        if(!fullName || !motto || !electionId) {
            return next(new httpError('All fields are required', 422));
        }

        if(!req.files?.image) {
            return next(new httpError('Image is required', 422));
        }

        // Get the image file from the request
        const { image } = req.files;

        // Check if image size is less than 1MB
        if(image.size > 1024 * 1024) {
            return next(new httpError('Image size should not exceed 1MB', 422));
        }

        // Rename the image file to avoid conflicts
        const imageName = `${Date.now()}-${uuidv4()}-${image.name}`;
        const uploadPath = path.join(uploadsDir, imageName);
        await image.mv(uploadPath, (err) => {
            if(err) {
                return next(new httpError('Failed to upload image', 500));
            }
        });

        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(uploadPath, {
            folder: 'mern-votely/candidates',
        });

        // Check if image was uploaded successfully
        if(!result.secure_url) {
            return next(new httpError('Failed to upload image to cloudinary', 422));
        }

        const imageUrl = result.secure_url;

        const electionExists = await ElectionModel.exists({ _id: electionId });
        if (!electionExists) {
            return next(new httpError('Election not found', 404));
        }

        const newCandidate = await CandidateModel.create({ fullName, image: imageUrl, motto, electionId });

        res.status(201).json({ message: "Candidate added successfully", newCandidate });
    } catch (error) {
        return next(new httpError(error));
    }
}

// GET CANDIDATE
// GET: /candidates/:id
// PROTECTED ROUTE - Only accessible by admin users
export const getCandidate = async (req, res, next) => {
    res.json({ message: "Candidate retrieved successfully" });
}

// GET ALL CANDIDATES
// GET: /candidates
// PROTECTED ROUTE - Only accessible by admin users
export const getAllCandidates = async (req, res, next) => {
    res.json({ message: "All candidates retrieved successfully" });
}

// UPDATE CANDIDATE
// PUT: /candidates/:id
// PROTECTED ROUTE - Only accessible by admin users
export const updateCandidate = async (req, res, next) => {
    res.json({ message: "Candidate updated successfully" });
}

// DELETE CANDIDATE
// DELETE: /candidates/:id
// PROTECTED ROUTE - Only accessible by admin users
export const deleteCandidate = (req, res, next) => {
    res.json({ message: "Candidate deleted successfully" });
}
