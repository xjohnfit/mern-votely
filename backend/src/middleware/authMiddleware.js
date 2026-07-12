import jwt from 'jsonwebtoken';
import httpError from '../utils/httpError.js';

const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token;

    if(!token) {
        return next(new httpError('Unauthorized', 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return next(new httpError('Unauthorized', 401));
        }
        req.user = decoded;
        next();
    });
};

export default authMiddleware;
