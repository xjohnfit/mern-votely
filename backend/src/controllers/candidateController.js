import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import httpError from '../utils/httpError.js';
import CandidateModel from '../models/candidatesModel.js';
import ElectionModel from '../models/electionModel.js';
import cloudinary from '../utils/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

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
        fs.unlink(uploadPath, () => {});

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
    try {
        const { id } = req.params;
        const candidate = await CandidateModel.findById(id);
        if(!candidate) {
            return next(new httpError('Candidate not found', 404));
        }
        res.status(200).json(candidate);
    } catch (error) {
        return next(new httpError(error));
    }
}

// GET ALL CANDIDATES
// GET: /candidates
// PROTECTED ROUTE - Only accessible by admin users
export const getAllCandidates = async (req, res, next) => {
    try {
        // Only admin can get all candidates
        if(!req.user.isAdmin) {
            return next(new httpError('Unauthorized', 401));
        }

        const candidates = await CandidateModel.find();
        if(!candidates.length) {
            return next(new httpError('No candidates found', 404));
        }
        res.status(200).json(candidates);
    } catch (error) {
        return next(new httpError(error));
    }
};

// UPDATE CANDIDATE
// PUT: /candidates/:id
// PROTECTED ROUTE - Only accessible by admin users
export const updateCandidate = async (req, res, next) => {
    try {

        // Only admin can update a candidate
        if(!req.user.isAdmin) {
            return next(new httpError('Unauthorized', 401));
        }

        const { id } = req.params;
        const candidate = await CandidateModel.findById(id);
        if(!candidate) {
            return next(new httpError('Candidate not found', 404));
        }

        const { fullName, motto } = req.body;
        if(!fullName || !motto) {
            return next(new httpError('All fields are required', 422));
        }

        const updateData = { fullName, motto };

        if(req.files?.image) {
            const { image } = req.files;
            if(image.size > 1024 * 1024) {
                return next(new httpError('Image size should not exceed 1MB', 422));
            }

            const imageName = `${Date.now()}-${uuidv4()}-${image.name}`;
            const uploadPath = path.join(uploadsDir, imageName);
            await image.mv(uploadPath, (err) => {
                if(err) {
                    return next(new httpError('Failed to upload image', 500));
                }
            });

            const result = await cloudinary.uploader.upload(uploadPath, {
                folder: 'mern-votely/candidates',
            });
            fs.unlink(uploadPath, () => {});
            if(!result.secure_url) {
                return next(new httpError('Failed to upload image to cloudinary', 422));
            }

            updateData.image = result.secure_url;
        }

        await CandidateModel.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ message: "Candidate updated successfully" });
    } catch (error) {
        return next(new httpError(error));
    }
}

// DELETE CANDIDATE
// DELETE: /candidates/:id
// PROTECTED ROUTE - Only accessible by admin users
export const deleteCandidate = async (req, res, next) => {
    try {

        // Only admin can delete a candidate
        if(!req.user.isAdmin) {
            return next(new httpError('Unauthorized', 401));
        }

        const { id } = req.params;
        const candidate = await CandidateModel.findById(id);
        if(!candidate) {
            return next(new httpError('Candidate not found', 404));
        }
        await candidate.deleteOne();
        res.status(200).json({ message: "Candidate deleted successfully" });
    } catch (error) {
        return next(new httpError(error));
    }
}
