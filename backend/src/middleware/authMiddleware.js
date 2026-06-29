import jwt from 'jsonwebtoken';
import httpError from '../utils/httpError.js';

const authMiddleware = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization || req.headers.Authorization;

    if(!authorizationHeader && !authorizationHeader.startsWith('Bearer ')) {
        return next(new httpError('Unauthorized', 401));
    }

    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return next(new httpError('Unauthorized', 401));
        }
        return decoded;
    });

    if(!decoded) {
        return next(new httpError('Unauthorized', 401));
    }

    req.user = decoded;
    next();
};

export default authMiddleware;
