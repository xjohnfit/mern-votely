import voterModel from "../models/voterModel.js";
import httpError from "../utils/httpError.js";
import bcrypt from "bcryptjs";

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

        res.status(201).json({ message: "Voter registered successfully", voter: newVoter });

    } catch (error) {
        return next(new httpError(error.message, 422));
    }
}

// POST: /voters/login
// UNPROTECTED ROUTE
export const loginVoter = async (req, res, next) => {
    res.json({ message: "Voter logged in successfully" });
}

// GET: /voters/:id
// PROTECTED ROUTE
export const getVoter = async (req, res, next) => {
    res.json({ message: "Voter retrieved successfully" });
}
