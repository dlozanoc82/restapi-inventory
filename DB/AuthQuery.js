import jwt from 'jsonwebtoken';
import { queryDatabase } from '../config/db.js'; 
import { config } from '../config/config.js';

const storeRefreshToken = async (token, userId) => {
    try {
        const query = `INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)`;
        await queryDatabase(query, [userId, token]);
    } catch (error) {
        console.error('Error saving refresh token', error);
        throw new Error('Failed to save refresh token');
    }
};

const deleteRefreshToken = async (token) => {
    try {
        const query = `DELETE FROM refresh_tokens WHERE token = ?`;
        await queryDatabase(query, [token]);
    } catch (error) {
        console.error('Error deleting refresh token', error);
        throw new Error('Failed to delete refresh token');
    }
};

const getRefreshTokenByUser = async (userId, token) => {
    const query = `SELECT * FROM refresh_tokens WHERE user_id = ? AND token = ?`;
    const result = await queryDatabase(query, [userId, token]);
    return result.length > 0 ? result[0] : null;
};

const verifyRefreshToken = (token) => {
    try {
        // Verificar el token con la clave secreta usada para firmarlo
        const decoded = jwt.verify(token, config.jwt.refreshSecret);
        return decoded;  // Devuelve el payload del token (por ejemplo, { id, role })
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

export {
    storeRefreshToken,
    deleteRefreshToken,
    getRefreshTokenByUser,
    verifyRefreshToken
};
