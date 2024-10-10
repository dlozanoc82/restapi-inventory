import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token is missing' });

    jwt.verify(token, config.jwt.secret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid access token' });
        req.user = user;
        next();
    });
};

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access forbidden: insufficient privileges' });
        }
        next();
    };
};

export { authenticateToken, authorizeRole };
