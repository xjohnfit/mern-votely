import voterModel from "../models/voterModel.js";
import httpError from "../utils/httpError.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token.js";

// POST: /voters/register
// UNPROTECTED ROUTE
export const registerVoter = async (req, res, next) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        if(!fullName || !email || !password || !confirmPassword) {
            return next(new httpError("Please fill all the fields", 422));
        }

        // all emails lowercase
        const newEmail = email.toLowerCase();

        // Check if voter email already exists
        const existingVoter = await voterModel.findOne({ email: newEmail });

        if(existingVoter) {
            return next(new httpError("Voter email already exists", 422));
        }

        // Check if password is 6+ characters
        if(password.length < 6) {
            return next(new httpError("Password must be at least 6 characters", 422));
        }

        // Check if password and confirmPassword match
        if(password !== confirmPassword) {
            return next(new httpError("Passwords do not match", 422));
        }

        // Hash password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Set admin email from .env file
        const adminEmail = process.env.ADMIN_EMAIL;

        let isAdmin = false;
        if(newEmail === adminEmail) {
            isAdmin = true;
        }

        // Save new voter to database
        const newVoter = await voterModel.create({
            fullName,
            email: newEmail,
            password: hashedPassword,
            isAdmin
        });

        const payload = {
            id: newVoter._id,
            fullName: newVoter.fullName,
            email: newVoter.email,
            votedElections: newVoter.votedElections,
            isAdmin: newVoter.isAdmin
        };

        // Generate JWT token
        const token = generateToken(payload);

        res.status(201).json({ message: "Voter registered successfully", token, voter: payload });

    } catch (error) {
        return next(new httpError(error.message, 422));
    }
}

// POST: /voters/login
// UNPROTECTED ROUTE
export const loginVoter = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return next(new httpError("Please fill all the fields", 422));
        }

        // all emails lowercase
        const newEmail = email.toLowerCase();

        // Check if voter email exists
        const existingVoter = await voterModel.findOne({ email: newEmail });

        if(!existingVoter) {
            return next(new httpError("Invalid email or password", 422));
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, existingVoter.password);

        if(!isMatch) {
            return next(new httpError("Invalid email or password", 422));
        }

        const payload = {
            id: existingVoter._id,
            fullName: existingVoter.fullName,
            email: existingVoter.email,
            votedElections: existingVoter.votedElections,
            isAdmin: existingVoter.isAdmin
        };

        // Generate JWT token
        const token = generateToken(payload);

        res.json({ message: "Voter logged in successfully", token, voter: payload });
    } catch(error) {
        return next(new httpError(error.message, 422));
    }
}

// GET: /voters/:id
// PROTECTED ROUTE
export const getVoter = async (req, res, next) => {
    const { id } = req.params;
    try {
        const voter = await voterModel.findById(id).select("-password");

        if(!voter) {
            return next(new httpError("Voter not found", 404));
        }

        res.json({ voter });
    } catch(error) {
        return next(new httpError('Could not retrieve voter', 422));
    }
}
