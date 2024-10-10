import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const generateAccessToken = (user) => {
    return jwt.sign(user, config.jwt.secret, { expiresIn: '15m' });
};

export const generateRefreshToken = (user) => {
    return jwt.sign(user, config.jwt.refreshSecret, { expiresIn: '7d' });
};
